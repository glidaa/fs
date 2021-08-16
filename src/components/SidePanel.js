import React from 'react';
import { connect } from "react-redux";
import styledComponents from "styled-components";
import "draft-js/dist/Draft.css";
import panelPages from "./panelPages"

const SidePanel = (props) => {
  const {
    app: {
      isRightPanelOpened,
      isLeftPanelOpened,
      rightPanelPage,
      leftPanelPage
    },
    isRight
  } = props;
  return (
    <SidePanelShell
      isOpened={(isRight && isRightPanelOpened) || (!isRight && isLeftPanelOpened)}
      isRight={isRight}
    >
      {isRight && rightPanelPage && React.createElement(panelPages[rightPanelPage])}
      {!isRight && leftPanelPage && React.createElement(panelPages[leftPanelPage])}
    </SidePanelShell>
  );
};

const SidePanelShell = styledComponents.div`
  display: flex;
  background-color: #FFFFFF;
  flex-direction: column;
  height: 100vh;
  border-radius: ${({ isRight }) => (isRight ? "35px 0 0 35px" : "0 35px 35px 0")};
  gap: 25px;
  flex: 1;
  transition: all 0.2s ease;
  transform: ${({ isOpened, isRight }) => (isOpened ? "translateX(0)" : `translateX(${isRight ? "100%" : "-100%"})`)};
  max-width: ${({ isOpened }) => (isOpened ? "100vw" : "0px")};
  overflow: ${({ isOpened }) => (isOpened ? "auto" : "hidden")};
  @media only screen and (max-width: 768px) {
    position: fixed;
    width: 100vw;
    border-radius: 0;
    max-width: 100vw;
  }
  z-index: 9999;
`;

export default connect((state) => ({
  app: state.app
}))(SidePanel);
