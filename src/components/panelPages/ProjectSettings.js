import React, { useState, useMemo } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as projectsActions from "../../actions/projects";
import { AuthState } from "../../constants";
import styled from "styled-components";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import Button from '../UI/Button';
import TextField from '../UI/fields/TextField';
import CardSelect from '../UI/fields/CardSelect';

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
              color="var(--primary)"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Project Settings</PanelPageTitle>
        <PanelPageToolbarAction onClick={removeProject}>
          <RemoveIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="var(--primary)"
          />
        </PanelPageToolbarAction>
      </PanelPageToolbar>
      <ProjectSettingsForm>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            type="text"
            name="title"
            label="Title"
            placeholder="title…"
            onChange={(e) => setNewTitle(e.target.value)}
            value={newTitle}
          />
          <TextField
            type="text"
            name="permalink"
            label="Permalink"
            placeholder="permalink…"
            onChange={(e) => setNewPermalink(e.target.value)}
            value={newPermalink}
            prefix={() => (
              <span>
                {/(\w+\/).*/.exec(permalink)?.[1]}
              </span>
            )}
          />
          {user.state === AuthState.SignedIn && (
            <>
              <CardSelect
                name="privacy"
                value={newPrivacy}
                label="Privacy"
                values={["public", "private"]}
                options={["Public", "Private"]}
                descriptions={[
                  "Make this project accessible to others via its unique permalink.",
                  "Make this project not visible to anyone other than you."
                ]}
                onChange={(e) => setNewPrivacy(e.target.value)}
              />
              <CardSelect
                name="permissions"
                value={newPermissions}
                label="Permissions"
                values={["rw", "r"]}
                options={["Read Write", "Read Only"]}
                descriptions={[
                  "Make this project writable by other users who have the permission to access its tasks.",
                  "Prevent other users who have the permission to access this project from modifying its contents."
                ]}
                onChange={(e) => setNewPermissions(e.target.value)}
              />
            </>
          )}
          <NonPrefixedInputField type="submit" name="submit" value="Submit"></NonPrefixedInputField>
        </form>
      </ProjectSettingsForm>
      <Button
        style={{margin: "0 25px 25px 25px"}}
        onClick={saveChanges}
        disabled={!isChanged}
      >
        Save Changes
      </Button>
    </>
  );
};

const ProjectSettingsForm = styled(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content > form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 25px 25px 25px;
    & > h2 > span {
      cursor: pointer;
    }
    & > input[type="submit"] {
      display: none;
    }
  }
`;

const NonPrefixedInputField = styled.input`
  width: calc(100% - 20px);
  padding: 5px 10px;
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

const PanelPageToolbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styled.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const PanelPageToolbarAction = styled.button`
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

export default connect((state) => ({
  app: state.app,
  projects: state.projects,
  user: state.user
}))(ProjectSettings);
