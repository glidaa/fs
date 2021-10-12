import React from "react"
import styled from "styled-components"
import { connect } from "react-redux";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects";
import formatDate from "../utils/formatDate";
import ProgressRing from "./ProgressRing";
import { ReactComponent as GlobeIcon } from "../assets/earth-outline.svg"
import { ReactComponent as DocumentLockIcon } from "../assets/document-lock-outline.svg"
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
  const shareProject = (e) => {
    e.stopPropagation()
    const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
    navigator.clipboard.writeText(linkToBeCopied)
  }
  const removeProject = (e) => {
    e.stopPropagation()
    dispatch(projectsActions.handleRemoveProject(project))
  }
  const selectProject = (id) => {
    if (selectedProject !== project.id) {
      dispatch(appActions.handleSetLeftPanel(false))
      dispatch(appActions.handleSetProject(id))
    }
  }
  return (
    <ProjectItemShell
      isSelected={selectedProject === project.id}
      onClick={() => selectProject(project.id)}
      {...listeners}
    >
      <ProjectItemPermission>
        {project.privacy === "public" && (
          <GlobeIcon
            height="200"
            width="200"
            strokeWidth="24"
            color="#000000"
          />
        )}
        {project.privacy === "private" && (
          <DocumentLockIcon
            height="200"
            width="200"
            strokeWidth="24"
            color="#000000"
          />
        )}
      </ProjectItemPermission>
      <ProjectItemContainer>
        <ProjectItemLeftPart>
          <ProjectItemHeader>
            <ProjectItemTitle isNullTitle={!project.title}>
              {project.title || "Untitled Project"}
            </ProjectItemTitle>
            <ProjectItemPermalink>{project.permalink}</ProjectItemPermalink>
          </ProjectItemHeader>
          <TasksCount>
            <TodoTasksCount>{project.todoCount}</TodoTasksCount>
            <PendingTasksCount>{project.pendingCount}</PendingTasksCount>
            <DoneTasksCount>{project.doneCount}</DoneTasksCount>
          </TasksCount>
          <ProjectItemDate>
            Created {formatDate(new Date(project.createdAt).getTime())}
          </ProjectItemDate>
        </ProjectItemLeftPart>
        <ProjectItemRightPart>
          <ProgressRing
            radius={36}
            stroke={3.5}
            progress={project.doneCount / (project.todoCount + project.pendingCount + project.doneCount) * 100}
          />
          <ProjectItemActions>
            <ProjectItemAction>
              <ShareIcon
                onClick={shareProject}
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

const ProjectItemShell = styled.div`
  background-origin: border-box!important;
  border: none;
  padding: 20px;
  margin: 0 25px;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
  background-color: var(--primary);
  ${({ isSelected }) => isSelected ? `
    border: 4px solid #F778BA;
  ` : `
    border: 4px solid transparent;
  `}
`

const ProjectItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  transition: background-color 0.3s;
  & * {
    z-index: 2;
  }
`;

const ProjectItemLeftPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 2;
  gap: 10px;
`

const ProjectItemRightPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  flex: 1;
`

const ProjectItemHeader = styled.div`
  display: flex;
  flex-direction: column;
`

const ProjectItemTitle = styled.span`
  color: #FFFFFF;
  font-weight: 600;
  font-size: 20px;
  max-width: 197.08px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const ProjectItemPermalink = styled.span`
  font-size: 12px;
  color: #FFFFFF;
  font-weight: 500;
  max-width: 197.08px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const TasksCount = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  color: #5D6969;
  font-size: 14px;
`

const TasksCountItem = styled.span`
  padding: 1px 10px;
  border-radius: 10px;
  &::before {
    content: "⬤ ";
    white-space: pre;
  }
`

const TodoTasksCount = styled(TasksCountItem)`
  background-color: #FFEBE5;
  &::before {
    color: #FF1744;
  }
`

const PendingTasksCount = styled(TasksCountItem)`
  background-color: #FDF1DB;
  &::before {
    color: #FF9100;
  }
`

const DoneTasksCount = styled(TasksCountItem)`
  background-color: #DAF6F4;
  &::before {
    color: #00E676;
  }
`

const ProjectItemActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`

const ProjectItemAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 1px 6px;
`

const ProjectItemPermission = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  right: 0;
  bottom: 0;
  opacity: 0.15;
  z-index: 1;
`

const ProjectItemDate = styled.span`
  font-size: 12px;
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