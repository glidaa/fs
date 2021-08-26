import React, { useState, useEffect, useMemo, useRef } from 'react';
import styledComponents from "styled-components"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import copyTask from "../../utils/copyTask";
import parseLinkedList from "../../utils/parseLinkedList";
import { connect } from "react-redux";
import { supportedCommands } from "../../constants"
import { ReactComponent as AssignIcon } from "../../assets/person-add-outline.svg"
import { ReactComponent as CalenderIcon } from "../../assets/calendar-outline.svg"
import { ReactComponent as TagsIcon } from "../../assets/pricetags-outline.svg"
import { ReactComponent as DescriptionIcon } from "../../assets/receipt-outline.svg"
import { ReactComponent as StatusIcon } from "../../assets/checkbox-outline.svg"
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../../assets/duplicate-outline.svg"
import { ReactComponent as ReorderIcon } from "../../assets/reorder-four-outline.svg"

const Commands = (props) => {
  const {
    app: {
      command,
      selectedTask,
      selectedProject
    },
    tasks,
    dispatch
  } = props

  const supportedIntents = Object.keys(supportedCommands)

  const getSuggestedIntents = (command) => {
    return supportedIntents.filter(x => new RegExp(`^${/^\/(\w*)\s*(.*)\s*$/m.exec(command)[1]}`, "i").test(x))
  }

  const suggestedIntents = useMemo(() => getSuggestedIntents(command), [command])

  const [selection, setSelection] = useState(0)
  const nonUpdatedSelection = useRef(selection)
  const nonUpdatedSuggestedIntents = useRef(suggestedIntents)

  const chooseCommand = (selectedCommand) => {
    switch(selectedCommand) {
      case "COPY":
        dispatch(appActions.setCommand(""))
        window.localStorage.setItem("tasksClipboard",
          "COPIEDTASKSTART=>" +
          JSON.stringify(tasks[selectedTask]) +
          "<=COPIEDTASKEND"
        )
        return dispatch(appActions.handleSetTask(null))
      case "DUPLICATE":
        dispatch(appActions.setCommand(""))
        dispatch(tasksActions.handleCreateTask(
          copyTask(
            tasks[selectedTask],
            selectedProject,
            parseLinkedList(
              tasks,
              "prevTask",
              "nextTask"
            ).reverse()[0]?.id
          )
        ))
        return dispatch(appActions.handleSetTask(null))
      case "DELETE":
        dispatch(appActions.setCommand(""))
        return dispatch(tasksActions.handleRemoveTask(tasks[selectedTask]))
      default:
        return dispatch(appActions.setCommand("/" + selectedCommand.toLowerCase() + " "))
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      const selection = nonUpdatedSelection.current
      const suggestedIntents = nonUpdatedSuggestedIntents.current
      if (e.key === "Enter") {
        chooseCommand(suggestedIntents[selection]) 
      } else if (e.key === "ArrowUp") {
        if (selection > 0) {
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        if (selection < suggestedIntents.length - 1) {
          setSelection(selection + 1)
        }
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [])

  useEffect(() => {
    nonUpdatedSelection.current = selection
    nonUpdatedSuggestedIntents.current = suggestedIntents
  }, [selection, suggestedIntents])

  useEffect(() => {
    setSelection(0)
  }, [command])

  return (
    <>
      {suggestedIntents.map((x, i) => (
        <CommandSuggestion
          key={x}
          isSelected={selection === i}
          onMouseEnter={() => setSelection(i)}
        >
          {x === "ASSIGN" && <AssignIcon color="#006EFF" strokeWidth="32" height={24} />}
          {x === "DUE" && <CalenderIcon color="#006EFF" fill="#006EFF" strokeWidth="32" height={24} />}
          {x === "TAGS" && <TagsIcon color="#006EFF" strokeWidth="32" height={24} />}
          {x === "DESCRIPTION" && <DescriptionIcon color="#006EFF" strokeWidth="32" height={24} />}
          {x === "STATUS" && <StatusIcon color="#006EFF" strokeWidth="32" height={24} />}
          {x === "DELETE" && <RemoveIcon color="#006EFF" strokeWidth="32" height={24} />}
          {x === "COPY" && <CopyIcon color="#006EFF" strokeWidth="32" height={24} />}
          {x === "DUPLICATE" && <DuplicateIcon color="#006EFF" strokeWidth="32" height={24} />}
          {x === "REORDER" && <ReorderIcon color="#006EFF" strokeWidth="32" height={24} />}
          <div>
            <span>{x}</span>
            <span>{supportedCommands[x].description}</span>
          </div>
        </CommandSuggestion>
      ))}
    </>
  );
};

const CommandSuggestion = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background-color: ${({ isSelected }) => isSelected ? "#F5F5F5" : "transparent"};
  padding: 10px 20px;
  transition: background-color 0.2s;
  cursor: pointer;
  & > div {
    display: flex;
    flex-direction: column;
    & > span:nth-child(1) {
      color: #222222;
      font-weight: 600;
      font-size: 14px;
      text-transform: lowercase;
      &::first-letter {
        text-transform: capitalize;
      }
    }
    & > span:nth-child(2) {
      color: #222222;
      font-weight: 400;
      font-size: 12px;
    }
  }
`

export default connect((state) => ({
	app: state.app,
	tasks: state.tasks
}))(Commands);