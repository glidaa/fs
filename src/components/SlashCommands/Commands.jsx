import React, { useState, useEffect, useMemo } from 'react'
import styles from "./Commands.module.scss"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import copyTask from "../../utils/copyTask"
import sortByRank from "../../utils/sortByRank"
import generateRank from "../../utils/generateRank"
import { useDispatch, useSelector } from "react-redux"
import { supportedCommands } from "../../constants"
import { ReactComponent as AssignIcon } from "@fluentui/svg-icons/icons/people_add_16_regular.svg"
import { ReactComponent as CalenderIcon } from "@fluentui/svg-icons/icons/calendar_ltr_16_regular.svg"
import { ReactComponent as TagsIcon } from "@fluentui/svg-icons/icons/tag_16_regular.svg"
import { ReactComponent as DescriptionIcon } from "@fluentui/svg-icons/icons/text_align_left_16_regular.svg"
import { ReactComponent as StatusIcon } from  "@fluentui/svg-icons/icons/checkbox_checked_16_regular.svg"
import { ReactComponent as RemoveIcon } from  "@fluentui/svg-icons/icons/delete_16_regular.svg"
import { ReactComponent as CopyIcon } from  "@fluentui/svg-icons/icons/copy_16_regular.svg"
import { ReactComponent as DuplicateIcon } from  "@fluentui/svg-icons/icons/document_copy_16_regular.svg"

const Commands = (props) => {
  const {
    command,
    onCommandChange,
    scrollableNodeRef,
  } = props

  const dispatch = useDispatch();

  const selectedTask = useSelector(state => state.app.selectedTask);
  const selectedProject = useSelector(state => state.app.selectedProject);

  const tasks = useSelector(state => state.tasks);

  const supportedIntents = Object.keys(supportedCommands)
  const supportedAlias = Object.fromEntries(Object.entries(supportedCommands).map(x => [x[1].alias, x[0]]).filter(x => x[0]))

  const getSuggestedIntents = (command) => {
    const commandTokens = /^(\w*)\s*(.*)\s*$/m.exec(command)
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
        onCommandChange(null)
        window.localStorage.setItem("tasksClipboard",
          "COPIEDTASKSTART=>" +
          JSON.stringify(tasks[selectedTask]) +
          "<=COPIEDTASKEND"
        )
        return dispatch(appActions.handleSetTask(null))
      case "DUPLICATE":
        onCommandChange(null)
        const sortedTasks = sortByRank(tasks)
        dispatch(tasksActions.handleCreateTask(
          copyTask(
            tasks[selectedTask],
            selectedProject,
            generateRank(
              tasks[selectedTask]?.rank,
              sortedTasks[sortedTasks.indexOf(tasks[selectedTask]) + 1]?.rank
            ),
            Object.keys(tasks)
          )
        ))
        return dispatch(appActions.handleSetTask(null))
      case "DELETE":
        onCommandChange(null)
        return dispatch(tasksActions.handleRemoveTask(tasks[selectedTask]))
      default:
        return onCommandChange(selectedCommand.toLowerCase() + " ")
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      const scrollableElem = scrollableNodeRef?.current
      const scrollableElemHeight = scrollableElem?.getBoundingClientRect().height
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        chooseCommand(suggestedIntents[selection]) 
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        e.stopPropagation()
        if (selection > 0) {
          const minHeight = scrollableElem?.scrollTop - 36 * (selection - 1) + scrollableElemHeight - 5
          if (scrollableElemHeight < minHeight) {
            scrollableElem?.scrollBy(0, scrollableElemHeight - minHeight)
          }
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        e.stopPropagation()
        if (selection < suggestedIntents.length - 1) {
          const minHeight = 5 + 36 * (selection + 2) - scrollableElem?.scrollTop
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
      {x === "ASSIGN" && <AssignIcon fill="currentColor" />}
      {x === "DUE" && <CalenderIcon fill="currentColor" />}
      {x === "TAGS" && <TagsIcon fill="currentColor" />}
      {x === "DESCRIPTION" && <DescriptionIcon fill="currentColor" />}
      {x === "STATUS" && <StatusIcon fill="currentColor" />}
      {x === "DELETE" && <RemoveIcon fill="currentColor" />}
      {x === "COPY" && <CopyIcon fill="currentColor" />}
      {x === "DUPLICATE" && <DuplicateIcon fill="currentColor" />}
      <div>
        <div>
          <span>{x}</span>
          {supportedCommands[x].alias && <span>{supportedCommands[x].alias}</span>}
        </div>
      </div>
    </div>
  )) : (
    <span className={styles.NoIntent}>
      No Commands Found
    </span>
  )
};

export default Commands;