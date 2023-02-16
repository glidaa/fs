import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useDrag } from '@use-gesture/react'
import { animated, useSpring, config } from '@react-spring/web'
import { useModal } from "../../ModalManager";
import styles from "./Sheet.module.scss"

const Sheet = forwardRef(({ content }, ref) => {

  const { hideModal } = useModal();
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(312);

  useEffect(() => {
    const height = containerRef?.current.getBoundingClientRect().height;
    setContainerHeight(height || 312) 
  }, [containerRef]);

  const [{ y }, api] = useSpring(() => ({ y: containerHeight }))

  const openSheet = ({ canceled }) => {
    api.start({ y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })
  }
  
  const closeSheet = () => new Promise((resolve) => {
    api.start({
      y: containerHeight,
      immediate: false,
      config: { ...config.stiff },
      onResolve: () => {
        resolve()
      }
    })
  })

  useImperativeHandle(ref, () => ({
    close() {
      return closeSheet()
    }
  }));
  
  const bind = useDrag(
    ({ last, velocity: [, vy], movement: [, my], cancel, canceled }) => {
      if (my < 0) {
        cancel()
      }
      if (last) {
        my > containerHeight * 0.5 || vy > 0.5 ?
        hideModal() :
        openSheet({ canceled })
      } else {
        api.start({ y: my, immediate: true })
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true
    }
  )
  
  const overlayBG = y.to((py) => `rgba(0, 0, 0, ${((containerHeight - py) / containerHeight) * 0.5})`)
  
  useEffect(() => {
    openSheet({ canceled: null })
  }, [])
  return (
    <animated.div
      className={styles.SheetShell}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeSheet().then(hideModal);
        }
      }}
      style={{ backgroundColor: overlayBG }}
    >
      <animated.div
        className={styles.SheetContainer}
        style={{ y }}
        ref={containerRef}
        {...bind()}
      >
        {content}
      </animated.div>
    </animated.div>
  )
})

Sheet.displayName = "Sheet";

export default Sheet