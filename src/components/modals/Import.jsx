import React, { useEffect, useState } from "react";
import styles from "./Import.module.scss";
import { useModal } from "../ModalManager";
import { parse } from 'csv-parse/browser/esm';
import FileField from "../UI/fields/FileField";
import Modal from "../UI/Modal/";
import * as tasksActions from "../../actions/tasks";
import copyTask from "../../utils/copyTask";
import { useDispatch, useSelector } from "react-redux";
import sortByRank from "../../utils/sortByRank";
import store from "../../store";
import generateRank from "../../utils/generateRank";
import formatDate from "../../utils/formatDate";

const Import = ({ importedBlob }) => {

  const dispatch = useDispatch();

  const selectedProject = useSelector(state => state.projects[state.app.selectedProject]);

  const [importedTasks, setImportedTasks] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const { modalRef, hideModal } = useModal();

  const findAlternativeStatus = (statusId) => {
    const statusSet = selectedProject.statusSet;
    const statusIdx = statusSet.findIndex(status => status.id === statusId || status.title === statusId || status.synonym === statusId);
    return statusIdx === -1 ? selectedProject.defaultStatus : statusSet[statusIdx].id;
  }

  const getStatusTitle = (statusId) => {
    const statusSet = selectedProject.statusSet;
    const statusIdx = statusSet.findIndex(status => status.id === statusId);
    return statusSet[statusIdx].title;
  }

  const handleChange = async (e) => {
    const blobs = e.target.files;
    const fileContents = await blobs[0].text();
    const type = blobs[0].type;
    if (type === "text/csv") {
      parse(fileContents, {
        columns: true,
        skip_empty_lines: true
      }, (err, output) => {
        if (err) {
          console.log(err);
          return;
        }
        setImportedTasks(
          output.map((task) => ({
            task: task.task || "",
            description: task.description || "",
            due: task.due ? new Date(task.due).toISOString() : null,
            tags: task.tags ? task.tags.split(",").map((tag) => tag.trim()) : [],
            status: findAlternativeStatus(task.status),
            priority: task.priority,
            assignees: [],
            anonymousAssignees: [],
            invitedAssignees: [],
          }))
        );
      });
    } else if (type === "application/json") {
      setImportedTasks(
        JSON.parse(fileContents).map((task) => ({
          task: task.task || "",
          description: task.description || "",
          due: task.due ? new Date(task.due).toISOString() : null,
          tags: task.tags ? task.tags.split(",").map((tag) => tag.trim()) : [],
          status: task.status,
          priority: task.priority,
          assignees: [],
          anonymousAssignees: [],
          invitedAssignees: [],
        }))
      );
    }
  }

  const handleImport = async () => {
    setIsBusy(true);
    for (const importedTask of importedTasks) {
      dispatch(
        tasksActions.handleCreateTask(
          copyTask(
            importedTask,
            selectedProject.id,
            generateRank(sortByRank(store.getState().tasks, true)[0]?.rank),
            Object.keys(store.getState().tasks)
          )
        )
      )
    }
    hideModal();
  }

  useEffect(() => {
    if (importedBlob) {
      handleChange({
        target: {
          files: [importedBlob]
        }
      });
    }
  }, [importedBlob]);

  return (
    <Modal
      title="Import Tasks"
      primaryButtonText={
        importedTasks.length
        ? `Import ${importedTasks.length} tasks`
        : "Import"
      }
      secondaryButtonText="Cancel"
      primaryButtonDisabled={importedTasks.length === 0 || isBusy}
      secondaryButtonDisabled={isBusy}
      onPrimaryButtonClick={handleImport}
      onSecondaryButtonClick={hideModal}
      modalRef={modalRef}
    >
      {importedTasks.length ? (
        <div className={styles.TasksList}>
          {importedTasks.map((task, i) => (
            <div key={i} className={styles.TaskItem}>
              <div className={styles.TaskData}>
                <span className={styles.TaskTask}>
                  {task.task}
                </span>
                {task.description ? (
                  <span>
                    <b>Description: </b>{task.description}
                  </span>
                ) : null}
                {task.due ? (
                  <span>
                    <b>Due: </b>{task.due ? formatDate(task.due) : "No due date"}
                  </span>
                ) : null}
                {task.tags.length ? (
                  <span>
                    <b>Tags: </b>{task.tags.join(", ")}
                  </span>
                ) : null}
                <span>
                  <b>Status: </b>{getStatusTitle(task.status)}
                </span>
                <span>
                  <b>Priority: </b>{task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <FileField onChange={handleChange} />
      )}
    </Modal>
  );
};

export default Import;