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
  background-color: #FFFFFF;
  flex-direction: column;
  height: 100vh;
  border-radius: ${({ isRight }) => (isRight ? "35px 0 0 35px" : "0 35px 35px 0")};
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
    border-radius: 0;
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
