import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../actions/app";
import * as projectsActions from "../../actions/projects";
import { AuthState } from "../../constants";
import styles from "./ProjectSettings.module.scss"
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_24_regular.svg";
import TextField from '../UI/fields/TextField';
import ComboBox from '../UI/fields/ComboBox';
import StatusSet from '../UI/fields/StatusSet';
import { useReadOnly } from '../ReadOnlyListener';

const ProjectSettings = forwardRef((_, ref) => {

  const dispatch = useDispatch();
  const readOnly = useReadOnly();

  const selectedProject = useSelector(state => state.app.selectedProject);
  const isSynced = useSelector(state => state.app.isSynced);

  const userState = useSelector(state => state.user.state);

  const projects = useSelector(state => state.projects);

  const {
    [selectedProject]: {
      id,
      title,
      rank,
      permalink,
      privacy,
      permissions,
      statusSet
    }
  } = projects

  const [newTitle, setNewTitle] = useState(title || "")
  const [newPermalink, setNewPermalink] = useState(/\w+\/(.*)/.exec(permalink)?.[1] || permalink)
  const [newPrivacy, setNewPrivacy] = useState(privacy)
  const [newPermissions, setNewPermissions] = useState(permissions)
  const [newStatusSet, setNewStatusSet] = useState(statusSet)

  const checkIsChanaged = (
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    newStatusSet,
    title,
    permalink,
    privacy,
    permissions,
    statusSet
  ) => (
    !(newTitle === (title || "") &&
    newPermalink === permalink &&
    newPrivacy === privacy &&
    newPermissions === permissions &&
    JSON.stringify(newStatusSet) === JSON.stringify(statusSet))
  )

  const isChanged = useMemo(() => checkIsChanaged(
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    newStatusSet,
    title,
    permalink,
    privacy,
    permissions,
    statusSet
  ), [
    newTitle,
    newPermalink,
    newPrivacy,
    newPermissions,
    newStatusSet,
    title,
    permalink,
    privacy,
    permissions,
    statusSet
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
      title: newTitle,
      rank,
      permalink: newPermalink,
      privacy: newPrivacy,
      permissions: newPermissions,
      statusSet: newStatusSet
    }))
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Project Settings",
      actionIcon: !readOnly ? RemoveIcon : null,
      submitLabel: isSynced
        ? "Save Changes"
        : "No Connection!",
      submitDisabled: !isChanged || readOnly,
      onClose: () => {
        closePanel()
      },
      onAction: () => {
        removeProject();
      },
      onSubmit: () => {
        saveChanges();
      },
    }
  }));
  return (
    <form className={styles.ProjectSettingsForm} onSubmit={(e) => e.preventDefault()}>
      <TextField
        type="text"
        name="title"
        label="Title"
        placeholder="title…"
        onChange={(e) => setNewTitle(e.target.value)}
        value={newTitle}
        readOnly={readOnly}
      />
      <TextField
        type="text"
        name="permalink"
        label="Permalink"
        placeholder="permalink…"
        onChange={(e) => setNewPermalink(e.target.value)}
        value={newPermalink}
        readOnly={readOnly}
        prefix={() => (
          <span>
            {/(\w+\/).*/.exec(permalink)?.[1]}
          </span>
        )}
      />
      {userState === AuthState.SignedIn && (
        <>
          <ComboBox
            name="privacy"
            value={newPrivacy}
            label="Privacy"
            options={[
              ["public", "Public"],
              ["private", "Private"],
            ]}
            onChange={(e) => setNewPrivacy(e.target.value)}
            readOnly={readOnly}
          />
          {newPrivacy === "public" && (
            <ComboBox
              name="permissions"
              value={newPermissions}
              label="Permissions"
              options={[
                ["rw", "Read Write"],
                ["r", "Read Only"],
              ]}
              onChange={(e) => setNewPermissions(e.target.value)}
              readOnly={readOnly}
            />
          )}
        </>
      )}
      <StatusSet
        name="statusSet"
        label="Status Set"
        value={newStatusSet}
        onChange={(e) => setNewStatusSet(e.target.value)}
        readOnly={readOnly}
      />
    </form>
  );
});

ProjectSettings.displayName = "ProjectSettings";

export default ProjectSettings;
