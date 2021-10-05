import React from 'react';
import { connect } from "react-redux";
import styled from "styled-components";
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

const SidePanelShell = styled.div`
  display: flex;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.6);
	box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
  flex-direction: column;
  height: 100vh;
  gap: 25px;
  flex: 1;
  transition: all 0.2s ease;
  width: 365px;
  max-width: 365px;
  min-width: 365px;
  transform: translateX(${({ isOpened, isRight }) => (isOpened ? "0px" : `${isRight ? "365px" : "-365px"}`)});
  margin: ${({ isOpened, isRight }) => (isOpened ? "0px" : `${isRight ? "0 0 0 -365px" : "0 -365px 0 0"}`)};
  overflow: ${({ isOpened }) => (isOpened ? "auto" : "hidden")};
  @media only screen and (max-width: 768px) {
    position: fixed;
    width: 100vw;
    max-width: 100vw;
    height: 100%;
    transform: translateX(${({ isOpened, isRight }) => (isOpened ? "0px" : `${isRight ? "100%" : "-100%"}`)});
    margin: 0;
  }
  z-index: 9999;
`;

export default connect((state) => ({
  app: state.app
}))(SidePanel);
