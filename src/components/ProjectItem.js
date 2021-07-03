import styledComponents from "styled-components";
import { connect } from "react-redux";
import { useState, useRef } from "react";
import { useOuterClick } from "react-outer-click";
import * as appActions from "../actions/app";
import * as projectsActions from "../actions/projects";
import parsePeriod from "../utils/parsePeriod";
import editIcon from "../assets/create-outline.svg";
import removeIcon from "../assets/trash-outline.svg";

const ProjectItem = (props) => {
  const { handler, app, project, readOnly, dispatch } = props;
  const inputRef = useRef(null);
  const [editMode, setEditMode] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  useOuterClick(inputRef, () => {
    if (editMode) {
      setEditMode(null);
      setIsEdit(false);
    }
  });
  return (
    <ProjectItemContainer
      isSelected={app.selectedProject === project.id}
      onClick={() => dispatch(appActions.handleSetProject(project.id))}
    >
      {handler && handler}
      <div className="projectItemInfo">
        {isEdit && editMode === "title" ? (
          <input
            ref={inputRef}
            value={project.title}
            onChange={(e) => {
              if (e.target.value !== project.title) {
                dispatch(
                  projectsActions.handleUpdateProject({
                    id: project.id,
                    title: e.target.value,
                  })
                );
              }
            }}
            onKeyUp={(e) =>
              e.key === "Enter" && setEditMode(null) && setIsEdit(true)
            }
          />
        ) : (
          <div className="projectListTitle">
            <span>{project.title}</span>
            {!readOnly && (
              <div>
                <img
                  alt="edit project title"
                  src={editIcon}
                  width="15"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode("title");
                    setIsEdit(true);
                  }}
                />
                <img
                  alt="remove project"
                  src={removeIcon}
                  width="15"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(projectsActions.handleRemoveProject(project));
                  }}
                />
              </div>
            )}
          </div>
        )}
        {/* {isEdit && editMode === "permalink" ? (
          <input
            ref={inputRef}
            value={project.permalink}
            onChange={(e) => {
              if (e.target.value !== project.permalink) {
                dispatch(
                  projectsActions.handleUpdateProject({
                    id: project.id,
                    permalink: e.target.value,
                  })
                );
              }
            }}
            onKeyUp={(e) =>
              e.key === "Enter" && setEditMode(null) && setIsEdit(false)
            }
          />
        ) : (
          <div className="projectListPermalink">
            <span>{project.permalink}</span>
            {!readOnly && (
              <div>
                <img
                  alt="edit project permalink"
                  src={editIcon}
                  width="15"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode("permalink");
                    setIsEdit(true);
                  }}
                />
              </div>
            )}
          </div>
        )} */}
        <span>{parsePeriod(new Date(project.createdAt).getTime())}</span>
      </div>
    </ProjectItemContainer>
  );
};

const ProjectItemContainer = styledComponents.div`
  display: flex;
  flex-direction: row;
  transition: background-color 0.3s;
  ${(props) =>
    props.isSelected
      ? `
    background-color: #E6F7FF;
    & > div {
      border-top: 1px solid transparent;
    }
  `
      : `
    cursor: pointer;
    &: hover {
      background-color: #E4E4E2;
      & > div {
        border-top: 1px solid transparent;
      }
    }
  `}
  & > div.projectItemInfo {
    position: relative;
    width: calc(90% - 33px);
    left: 10%;
    padding: 15px 20px 15px 5px;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #E4E4E2;
    & > div.projectListTitle {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      & > span {
        font-style: italic;
        color: grey;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      & > div {
        display: none;
      }
      &:hover {
        & > div {
          display: flex;
          flex-direction: row;
          gap: 5px;
          align-items: center;
          & > img {
            cursor: pointer;
          }
        }
      }
    }
    & > div.projectListPermalink {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      & > span {
        font-style: italic;
        color: grey;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      & > div {
        display: none;
      }
      &:hover {
        & > div {
          display: flex;
          flex-direction: row;
          gap: 5px;
          align-items: center;
          & > img {
            cursor: pointer;
          }
        }
      }
    }
    & > span {
      color: #222222;
      font-weight: 600;
    }
  }

  @media only screen and (max-width: 768px) {
    width: 300px;
    & > div.projectItemInfo > div.projectListTitle  {
      display: flex !important;
      & > div {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        & > img {
          cursor: pointer;
        }
      }
    }
	}
`;

export default connect((state) => ({
  app: state.app,
}))(ProjectItem);
