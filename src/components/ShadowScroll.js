import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

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
    node.addEventListener('scroll', onScroll);
    node.addEventListener('resize', onScroll);
    node.addEventListener("wheel", (e) => {
      e.preventDefault();
      node.scrollLeft += e.deltaY;
    });
    return () => {
      node.removeEventListener('scroll', onScroll);
      node.removeEventListener('resize', onScroll);
      node.removeEventListener('wheel', onScroll);
    };
  }, []);

  return (
    <Shadow showEnd={showEnd} showStart={showStart}>
      <Container ref={ref}>
        {props.children}
      </Container>
    </Shadow>
  );
};

const Shadow = styled.div`
  position: relative;
  width: 100%;
  ${({showStart}) => showStart ? css`
    ::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 10px;
      z-index: 1;
      background: linear-gradient(
        to left,
        rgba(255, 255, 255, 0),
        rgba(50, 50, 50, 0.15)
      );
    }
  ` : ''}
  ${({showEnd}) => showEnd ? css`
    ::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 10px;
      z-index: 1;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(50, 50, 50, 0.15)
      );
    }
  ` : ''}
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  width: 100%;
  height: 100px;
  scroll-behavior: smooth;
  & > *:not(:last-child) {
    margin-right: 5px;
  }
  @media (hover: none) {
    overflow: auto;
  }
`;

export default ShadowScroll;