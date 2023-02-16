import React, { useState, useEffect, useRef } from 'react';
import styles from "./ShadowScroll.module.scss"

const ShadowScroll = (props) => {
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const { scrollWidth = 0, scrollLeft = 0, offsetWidth = 0 } =
        ref.current || {};
      setShowStart(scrollLeft > 0);
      setShowEnd(scrollLeft + offsetWidth + 0.6 < scrollWidth);
    };
    onScroll();
    const node = ref.current;
    const isResizeObserverSupported = "ResizeObserver" in window;
    const observer = isResizeObserverSupported ? 
      new ResizeObserver(onScroll) :
      new MutationObserver(onScroll);
    if (isResizeObserverSupported) observer.observe(node);
    else observer.observe(node, { childList: true, subtree: true });
    node.addEventListener('scroll', onScroll);
    node.addEventListener("wheel", (e) => {
      e.preventDefault();
      node.scrollLeft += e.deltaY;
    });
    return () => {
      observer.disconnect();
      node.removeEventListener('scroll', onScroll);
      node.removeEventListener('wheel', onScroll);
    };
  }, []);

  return (
    <div
      style={props.style}
      className={[
        styles.Shadow,
        ...(showStart && [styles.showStart] || []),
        ...(showEnd && [styles.showEnd] || [])
      ].join(" ")}
    >
      <div className={styles.Container} ref={ref}>
        {props.children}
      </div>
    </div>
  );
};

export default ShadowScroll;