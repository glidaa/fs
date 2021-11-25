import React, { useState, useEffect, useMemo } from 'react'
import styles from "./Commands.module.scss"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import copyTask from "../../utils/copyTask"
import parseLinkedList from "../../utils/parseLinkedList"
import { connect } from "react-redux"
import { supportedCommands } from "../../constants"
import { ReactComponent as AssignIcon } from "../../assets/person-add-outline.svg"
import { ReactComponent as CalenderIcon } from "../../assets/calendar-outline.svg"
import { ReactComponent as TagsIcon } from "../../assets/pricetags-outline.svg"
import { ReactComponent as DescriptionIcon } from "../../assets/receipt-outline.svg"
import { ReactComponent as StatusIcon } from "../../assets/checkbox-outline.svg"
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../../assets/duplicate-outline.svg"

const Commands = (props) => {
  const {
    app: {
      command,
      selectedTask,
      selectedProject
    },
    scrollableNodeRef,
    tasks,
    dispatch
  } = props

  const supportedIntents = Object.keys(supportedCommands)
  const supportedAlias = Object.fromEntries(Object.entries(supportedCommands).map(x => [x[1].alias, x[0]]).filter(x => x[0]))

  const getSuggestedIntents = (command) => {
    const commandTokens = /^\/(\w*)\s*(.*)\s*$/m.exec(command)
    let results = supportedIntents.filter(x => new RegExp(`^${commandTokens[1]}`, "i").test(x))
    if (supportedAlias[commandTokens[1].toLowerCase()]) {
      if (results.includes(supportedAlias[commandTokens[1].toLowerCase()])) {
        results = results.filter(x => x !== supportedAlias[commandTokens[1].toLowerCase()])
      }
      results.unshift(supportedAlias[commandTokens[1].toLowerCase()])
    }
    return results.length ? results : null
  }

  const suggestedIntents = useMemo(() => getSuggestedIntents(command), [command])

  const [selection, setSelection] = useState(0)

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
      const scrollableElem = scrollableNodeRef?.current
      const scrollableElemHeight = scrollableElem?.getBoundingClientRect().height
      if (e.key === "Enter") {
        chooseCommand(suggestedIntents[selection]) 
      } else if (e.key === "ArrowUp") {
        if (selection > 0) {
          const minHeight = scrollableElem?.scrollTop - 59 * (selection - 1) + scrollableElemHeight - 15
          if (scrollableElemHeight < minHeight) {
            scrollableElem?.scrollBy(0, scrollableElemHeight - minHeight)
          }
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        if (selection < suggestedIntents.length - 1) {
          const minHeight = 15 + 59 * (selection + 2) - scrollableElem?.scrollTop
          if (scrollableElemHeight < minHeight) {
            scrollableElem?.scrollBy(0, minHeight - scrollableElemHeight)
          }
          setSelection(selection + 1)
        }
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [selection, suggestedIntents])

  useEffect(() => {
    setSelection(0)
  }, [command])

  return suggestedIntents ? suggestedIntents.map((x, i) => (
    <div
      className={[
        styles.CommandSuggestion,
        ...(selection === i && [styles.selected] || [])
      ].join(" ")}
      key={x}
      onMouseEnter={() => setSelection(i)}
      onClick={() => chooseCommand(x)}
    >
      {x === "ASSIGN" && <AssignIcon height={24} />}
      {x === "DUE" && <CalenderIcon height={24} />}
      {x === "TAGS" && <TagsIcon height={24} />}
      {x === "DESCRIPTION" && <DescriptionIcon height={24} />}
      {x === "STATUS" && <StatusIcon height={24} />}
      {x === "DELETE" && <RemoveIcon height={24} />}
      {x === "COPY" && <CopyIcon height={24} />}
      {x === "DUPLICATE" && <DuplicateIcon height={24} />}
      <div>
        <div>
          <span>{x}</span>
          {supportedCommands[x].alias && <span>{supportedCommands[x].alias}</span>}
        </div>
        <span>{supportedCommands[x].description}</span>
      </div>
    </div>
  )) : (
    <span className={styles.NoIntent}>
      No Commands Found
    </span>
  )
};

export default connect((state) => ({
	app: state.app,
	tasks: state.tasks
}))(Commands);