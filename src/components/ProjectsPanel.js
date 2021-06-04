import React from "react";
import styledComponents from "styled-components";
import useWindowSize from "../utils/useWindowSize";

export const ProjectsPanel = ({ hideShowPanel, setHideShowPanel }) => {
  const { width } = useWindowSize();
  return width > 768 ? (
    <Panel open={open} data-testid="sidePanel">
      {["Project 1", "Project 2", "Project 3"].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </Panel>
  ) : (
    <Panel open={hideShowPanel} data-testid="sidePanel">
      <Button data-testid="close" onClick={setHideShowPanel}>
        X
      </Button>
      {["Project 1", "Project 2", "Project 3"].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </Panel>
  );
};

const Button = styledComponents.button`
background: none;
border: none;
font-size: 14px;
font-weight: 600;
position: absolute;
top: 1%;
right: 4px;
`;

const Panel = styledComponents.div`
  background-color: #FFFFFF;
  flex: 1;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 8px 1px #dadada;
  top: 0;
  left: 0;
  & > span {
    font-weight: 600;
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
  flex-direction: column;
  background: ${({ theme }) => theme.primaryLight};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  z-index: 1;
  }
`;
