import React from "react"
import styledComponents from "styled-components"
import { connect } from "react-redux";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects";
import formatDate from "../utils/formatDate";
import ProgressRing from "./ProgressRing";
import AvatarArray from "./AvatarArray";
import { ReactComponent as GlobeIcon } from "../assets/earth-outline.svg"
import { ReactComponent as RemoveIcon } from "../assets/trash-outline.svg"
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"

const ProjectItem = (props) => {
  const {
    app: {
      selectedProject
    },
    project,
    dispatch,
    listeners
  } = props
  const removeProject = () => {
    dispatch(projectsActions.handleRemoveProject(project))
  }
  return (
    <ProjectItemShell
      isSelected={selectedProject === project.id}
      onClick={() => dispatch(appActions.handleSetProject(project.id))}
      {...listeners}
    >
      <ProjectItemPermission>
        <GlobeIcon
          height="200"
          width="200"
          strokeWidth="24"
          color="#000000"
        />
      </ProjectItemPermission>
      <ProjectItemContainer>
        <ProjectItemLeftPart>
          <ProjectItemHeader>
            <ProjectItemTitle>{project.title}</ProjectItemTitle>
            <ProjectItemPermalink>{project.permalink}</ProjectItemPermalink>
          </ProjectItemHeader>
          <TasksCount>
            <UnbegunTasksCount>12</UnbegunTasksCount>
            <OngoingTasksCount>24</OngoingTasksCount>
            <FinishedTasksCount>8</FinishedTasksCount>
          </TasksCount>
          <AvatarArray borderColor="#006EFF" size="38" />
          <ProjectItemDate>
            Created {formatDate(new Date(project.createdAt).getTime())}
          </ProjectItemDate>
        </ProjectItemLeftPart>
        <ProjectItemRightPart>
          <ProgressRing
            radius={42}
            stroke={5}
            progress={75}
          />
          <ProjectItemActions>
            <ProjectItemAction>
              <ShareIcon
                height="20"
                width="20"
                strokeWidth="42"
                color="#FFFFFF"
              />
            </ProjectItemAction>
            <ProjectItemAction>
              <RemoveIcon
                onClick={removeProject}
                height="20"
                width="20"
                strokeWidth="42"
                color="#FFFFFF"
              />
            </ProjectItemAction>
          </ProjectItemActions>
        </ProjectItemRightPart>
      </ProjectItemContainer>
    </ProjectItemShell>
  );
};

const ProjectItemShell = styledComponents.div`
  position: relative;
  background-color: #006EFF;
  padding: 20px;
  margin: 0 25px;
  border-radius: 10px; 
  overflow: hidden;
  ${({ isSelected }) => isSelected ? `
    border: 4px solid #F778BA;
  ` : `
    border: 4px solid transparent;
  `}
`

const ProjectItemContainer = styledComponents.div`
  display: flex;
  flex-direction: row;
  transition: background-color 0.3s;
  & * {
    z-index: 2;
  }
`;

const ProjectItemLeftPart = styledComponents.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 2;
  gap: 10px;
`

const ProjectItemRightPart = styledComponents.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  flex: 1;
`

const ProjectItemHeader = styledComponents.div`
  display: flex;
  flex-direction: column;
`

const ProjectItemTitle = styledComponents.span`
  color: #FFFFFF;
  font-weight: 600;
  font-size: 1.4em;
  max-width: 197.08px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const ProjectItemPermalink = styledComponents.span`
  font-size: 0.8em;
  color: #FFFFFF;
  font-weight: 500;
  max-width: 197.08px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const TasksCount = styledComponents.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  color: #5D6969;
  font-size: 0.9em;
`

const TasksCountItem = styledComponents.span`
  padding: 1px 10px;
  border-radius: 10px;
  &::before {
    content: "⬤ ";
    white-space: pre;
  }
`

const UnbegunTasksCount = styledComponents(TasksCountItem)`
  background-color: #FFEBE5;
  &::before {
    color: #FF1744;
  }
`

const OngoingTasksCount = styledComponents(TasksCountItem)`
  background-color: #FDF1DB;
  &::before {
    color: #FF9100;
  }
`

const FinishedTasksCount = styledComponents(TasksCountItem)`
  background-color: #DAF6F4;
  &::before {
    color: #00E676;
  }
`

const ProjectItemActions = styledComponents.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`

const ProjectItemAction = styledComponents.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 1px 6px;
`

const ProjectItemPermission = styledComponents.div`
  position: absolute;
  width: 150px;
  height: 150px;
  right: 0;
  bottom: 0;
  opacity: 0.15;
  z-index: 1;
`

const ProjectItemDate = styledComponents.span`
  font-size: 0.8em;
  color: #FFFFFF;
  font-weight: 500;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export default connect((state) => ({
  app: state.app
}))(ProjectItem);