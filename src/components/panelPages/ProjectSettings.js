import React, { useState, useMemo } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as projectsActions from "../../actions/projects";
import { AuthState } from "../../constants";
import styledComponents from "styled-components";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import PrivacyField from '../PrivacyField';
import PermissionsField from '../PermissionsField';

const ProjectSettings = (props) => {
  const {
    app: {
        selectedProject
    },
    user,
    projects,
    dispatch
  } = props;

  const {
    [selectedProject]: {
      id,
      title,
      permalink,
      privacy,
      permissions
    }
  } = projects

  const [newTitle, setNewTitle] = useState(title || "")
  const [newPermalink, setNewPermalink] = useState(/\w+\/(.*)/.exec(permalink)?.[1] || permalink)
  const [newPrivacy, setNewPrivacy] = useState(privacy)
  const [newPermissions, setNewPermissions] = useState(permissions)

  const checkIsChanaged = (
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    title,
    permalink,
    privacy,
    permissions
  ) => (
    !(newTitle === (title || "") &&
    newPermalink === (/\w+\/(.*)/.exec(permalink)?.[1] || permalink) &&
    newPrivacy === privacy &&
    newPermissions === permissions)
  )

  const isChanged = useMemo(() => checkIsChanaged(
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    title,
    permalink,
    privacy,
    permissions
  ), [
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    title,
    permalink,
    privacy,
    permissions
  ])
  
  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const removeProject = () => {
    dispatch(projectsActions.handleRemoveProject(projects[selectedProject]))
  }
  const saveChanges = () => {
    dispatch(projectsActions.handleUpdateProject({
      id,
      ...(newTitle !== (title || "") && { title: newTitle }),
      ...(newPermalink !== (/\w+\/(.*)/.exec(permalink)?.[1] || permalink) && { permalink: newPermalink }),
      ...(newPrivacy !== privacy && { privacy: newPrivacy }),
      ...(newPermissions !== permissions && { permissions: newPermissions })
    }))
  }
  return (
    <>
      <PanelPageToolbar>
        <PanelPageToolbarAction onClick={closePanel}>
          <BackArrowIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Project Settings</PanelPageTitle>
        <PanelPageToolbarAction onClick={removeProject}>
          <RemoveIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
      </PanelPageToolbar>
      <ProjectSettingsForm>
        <form onSubmit={(e) => e.preventDefault()}>
          <ProjectSetting>
            <label htmlFor="title">
              Title
            </label>
            <NonPrefixedInputField
              type="text"
              name="title"
              placeholder="title…"
              onChange={(e) => setNewTitle(e.target.value)}
              value={newTitle}
            />
          </ProjectSetting>
          <ProjectSetting>
            <label htmlFor="permalink">
              Permalink
            </label>
            <PrefixedInputField>
              <span>
                {/(\w+\/).*/.exec(permalink)?.[1]}
              </span>
              <input
                type="text"
                name="permalink"
                placeholder="permalink…"
                onChange={(e) => setNewPermalink(e.target.value)}
                value={newPermalink}
              />
            </PrefixedInputField>
          </ProjectSetting>
          {user.state === AuthState.SignedIn && (
            <>
              <ProjectSetting>
                <label htmlFor="privacy">
                  Privacy
                </label>
                <PrivacyField
                  value={newPrivacy}
                  onChange={(e) => setNewPrivacy(e.target.value)}
                />
              </ProjectSetting>
              <ProjectSetting>
                <label htmlFor="permissions">
                  Permissions
                </label>
                <PermissionsField
                  value={newPermissions}
                  onChange={(e) => setNewPermissions(e.target.value)}
                />
              </ProjectSetting>
            </>
          )}
          <NonPrefixedInputField type="submit" name="submit" value="Submit"></NonPrefixedInputField>
        </form>
      </ProjectSettingsForm>
      <SaveSettingsBtn
        onClick={saveChanges}
        disabled={!isChanged}
      >
        Save Changes
      </SaveSettingsBtn>
    </>
  );
};

const ProjectSettingsForm = styledComponents(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content > form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    & > h2 > span {
      cursor: pointer;
    }
    & > input[type="submit"] {
      display: none;
    }
  }
`;

const ProjectSetting = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0 25px;
  gap: 5px;
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 16px;
    font-weight: 600;
  }
`

const NonPrefixedInputField = styledComponents.input`
  width: calc(100% - 20px);
  padding: 10px 10px;
  border: 1px solid #C0C0C0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  &:disabled {
    background-color: #FAFAFA;
  }
  &::placeholder {
    color: #C0C0C0;
  }
`

const PrefixedInputField = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: calc(100% - 20px);
  padding: 10px 10px;
  border: 1px solid #C0C0C0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  & > span {
    color: #C0C0C0;
  }
  background-color: ${({ disabled }) => disabled ? "#FAFAFA" : "transparent"};
  & > input {
    border: none;
    outline: none;
    padding: 0;
    &:disabled {
      background-color: #FAFAFA;
    }
    &::placeholder {
      color: #C0C0C0;
    }
  }
`

const PanelPageToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styledComponents.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const PanelPageToolbarAction = styledComponents.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

const SaveSettingsBtn = styledComponents.button`
  padding: 15px 0;
  margin: 0 25px 25px 25px;
  background-color: #006EFF;
  color: #FFFFFF;
  border-radius: 8px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s linear;
  &:hover {
    background-color: #0058cc;
  }
  &:disabled {
    background-color: #338bff;
  }
`

export default connect((state) => ({
  app: state.app,
  projects: state.projects,
  user: state.user
}))(ProjectSettings);
