import styledComponents from "styled-components";

export const ProjectsPanel = () => {
  return (
    <Panel data-testid="sidePanel">
      {["Project 1", "Project 2", "Project 3"].map(item => <span key={item}>{item}</span>)}
    </Panel>
  );  
}

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
`;
