import React, { useRef, useMemo, useEffect } from "react"
import styledComponents from "styled-components";
import { connect } from "react-redux";
import { AuthState } from "@aws-amplify/ui-components";
import useWindowSize from "../utils/useWindowSize";
import formatDate from "../utils/formatDate"
import copyTaskCore from "../utils/copyTask"
import * as appActions from "../actions/app";
import * as tasksActions from "../actions/tasks";
import { ReactComponent as CheckmarkIcon } from "../assets/checkmark-outline.svg";
import { ReactComponent as OptionsIcon } from "../assets/ellipsis-vertical.svg";
import { ReactComponent as RemoveIcon } from "../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../assets/duplicate-outline.svg"
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"
import { ReactComponent as DetailsIcon } from "../assets/info_black_24dp.svg";
import Specials from "./Specials";
import { OK, initTaskState } from "../constants";
import AvatarArray from "./AvatarArray";

const TaskItem = (props) => {

	const {
		item,
		tasks,
		users,
        user,
		projects,
		app: {
			selectedTask,
			selectedProject,
			taskAddingStatus,
			isRightPanelOpened,
			isActionSheetOpened,
			lockedTaskField,
			command
		},
		listeners,
		isSorting,
		isDragging,
		dispatch
	} = props;

	const { width } = useWindowSize();

	const inputRef = useRef(null)

	const processAssingees = (value, users) => {
		const result = []
		for (const assignee of value) {
			const isValidAssignee = /^(user|anonymous):(.*)$/.test(assignee)
			if (isValidAssignee) {
				const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
				const isUser = assigneeType === "user"
				if (isUser) {
					result.push({...users[assigneeID], isUser})
				} else {
					result.push({ name: assigneeID, isUser })
				}
			}
		}
		return result
	}

  const getReadOnly = (user, projects, selectedProject) => {
    return user.state === AuthState.SignedIn &&
		projects[selectedProject]?.owner !== user.data.username &&
		projects[selectedProject]?.permissions === "r"
  }

  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject), [user, projects, selectedProject])
	
	const processedAssingees = useMemo(() => processAssingees(item.assignees, users), [item.assignees, users]);

	const getSpecialsPos = (inputRef) => {
		if (inputRef.current) {
			const inputPos = inputRef.current.getBoundingClientRect()
			const cursorPos = 
				inputRef.current.selectionStart * 9.6 < inputPos.left - 40 ?
				inputPos.left - 40 :
				inputRef.current.selectionStart * 9.6
			return {
				top: inputPos.top + 40,
				left: inputPos.left - 160 + cursorPos
			}
		} else {
			return {
				top: 0,
				left: 0
			}
		}
	}

	const specialsPos = useMemo(() => getSpecialsPos(inputRef), [tasks])

	const onChange = (e) => {
		if (lockedTaskField !== "task") {
			dispatch(appActions.setLockedTaskField("task"))
		}
		dispatch(
			tasksActions.handleUpdateTask({
				id: selectedTask,
				task: e.target.value,
			})
		);
	};

	const toggleStatus = (item) => {
		dispatch(
			tasksActions.handleUpdateTask({
				id: item.id,
				status: item.status === "done" ? "todo" : "done",
			})
		);
	};

	const handleKeyUp = (e) => {
		if (!command) {
			if (e.key === "Enter") {
				if (taskAddingStatus === OK && !readOnly) {
					dispatch(
						tasksActions.handleCreateTask(
							initTaskState(
								selectedProject,
								selectedTask,
								tasks[selectedTask].nextTask
							)
						)
					);
				}
			} else if (e.key === "ArrowUp") {
				const prevTask = tasks[selectedTask].prevTask
				if (!prevTask) {
					return dispatch(appActions.handleSetProjectTitle(true))
				} else {
					return dispatch(appActions.handleSetTask(prevTask))
				}
			} else if (e.key === "ArrowDown") {
				const nextTask = tasks[selectedTask].nextTask
				if (nextTask) {
					return dispatch(appActions.handleSetTask(nextTask))
				}
			} else if (e.key === "Escape") {
				return dispatch(appActions.handleSetTask(null))
			}
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter") {
			e.preventDefault()
		}
	}

	const onChooseSuggestion = (suggestion) =>
		dispatch(
			tasksActions.handleUpdateTask({
				id: selectedTask,
				task: tasks[selectedTask] + suggestion,
			})
		);

	const openActionSheet = (item) => {
		dispatch(
			appActions.handleSetTask(item.id)
		)
		dispatch(
			appActions.setActionSheet(true)
		)
	}

	const selectItem = (item) => {
		return dispatch(appActions.handleSetTask(item.id))
	}

	const openRightPanel = (item) => {
		if (item.id !== selectedTask) {
			dispatch(appActions.handleSetTask(item.id))
		}
		if (!isRightPanelOpened) {
			return dispatch(appActions.handleSetRightPanel(true))
		}
	}

	const copyTask = (item) => {
		window.localStorage.setItem(
			"tasksClipboard",
			"COPIEDTASKSTART=>" +
			JSON.stringify(item) +
			"<=COPIEDTASKEND"
		);
	}

	const duplicateTask = (item) => {
		dispatch(
			tasksActions.handleCreateTask(
				copyTaskCore(
					item,
					selectedProject,
					item.id,
					item.nextTask
				)
			)
		);
	}

	const shareTask = () => {
		const linkToBeCopied = window.location.href
		navigator.clipboard.writeText(linkToBeCopied)
	}

	const removeTask = (item) => {
		dispatch(tasksActions.handleRemoveTask(item))
	}

	return (
		<TaskItemShell
			{...listeners}
			isSorting={isSorting}
			isDragging={isDragging}
		>
			<TaskItemCore
				isSorting={isSorting}
				isDragging={isDragging}
				isFocused={item.id === selectedTask}
			>
				<TaskItemLeftPart>
					<TaskItemLeftLeftPart>
						<TaskItemStatusToggle
							isDone={item.status === "done"}
							onClick={() => toggleStatus(item)}
						>
							{item.status === "done" && (
								<CheckmarkIcon
									stroke="#FFFFFF"
									strokeWidth="32"
									width="24"
									height="24"
								/>
							)}
						</TaskItemStatusToggle>
						{selectedTask === item.id ? (
							<TaskItemInput>
								<input
									type="text"
									ref={inputRef}
									className="task"
									placeholder="Task…"
									value={tasks[selectedTask].task + command}
									onKeyUp={handleKeyUp}
									onKeyDown={handleKeyDown}
									onChange={onChange}
									autoFocus={!(isRightPanelOpened || isActionSheetOpened)}
									contentEditable={false}
                  readOnly={readOnly}
								/>
							</TaskItemInput>
						) : (
							<TaskItemHeader
								onClick={() => selectItem(item)}
                isPlaceholder={!item.task}
                isDone={item.status === "done"}
							>
								{item.task || "Task…"}
							</TaskItemHeader>
						)}
					</TaskItemLeftLeftPart>
					<TaskItemLeftRightPart>
						{width > 768 ?
						<TaskItemActions>
							<TaskItemAction onClick={() => copyTask(item)}>
								<CopyIcon
									height="18"
									strokeWidth="34"
									color="#006EFF"
								/>
							</TaskItemAction>
							{!readOnly && (
                <TaskItemAction onClick={() => duplicateTask(item)}>
                  <DuplicateIcon
                    height="18"
                    strokeWidth="34"
                    color="#006EFF"
                  />
                </TaskItemAction>
              )}
							<TaskItemAction onClick={() => shareTask(item)}>
								<ShareIcon
									height="18"
									strokeWidth="34"
									color="#006EFF"
								/>
							</TaskItemAction>
							{!readOnly && (
                <TaskItemAction onClick={() => removeTask(item)}>
                  <RemoveIcon
                    height="18"
                    strokeWidth="34"
                    color="#006EFF"
                  />
							  </TaskItemAction>
              )}
							<TaskItemAction onClick={() => openRightPanel(item)}>
								<DetailsIcon
									height="18"
									strokeWidth="34"
									color="#006EFF"
								/>
							</TaskItemAction>
						</TaskItemActions> :
						<TaskItemOptsBtn onClick={() => openActionSheet(item)}>
							<OptionsIcon
								stroke="#000000"
								strokeWidth="32"
								width="18"
							/>
						</TaskItemOptsBtn>}
					</TaskItemLeftRightPart>
				</TaskItemLeftPart>
				<TaskItemRightPart isFocused={item.id === selectedTask}>
					<TaskItemDueDate>
						{item.due ? formatDate(item.due) : "No Due"}
					</TaskItemDueDate>
					<AvatarArray
						max={3}
						users={processedAssingees}
						borderColor="#F8F8F8"
						size={ width > 768 ? 24 : 18 }
					/>
				</TaskItemRightPart>
			</TaskItemCore>
			{(command && selectedTask === item.id) && (
				<Specials
					onChooseSuggestion={onChooseSuggestion}
					posInfo={specialsPos}
				/>
			)}
		</TaskItemShell>
	);
};


const TaskItemActions = styledComponents.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 5px;
	opacity: 0;
	width: 0;
	background-color: transparent;
	&:hover {
		transition: opacity 0.2s;
	}
`

const TaskItemAction = styledComponents.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: transparent;
	padding: 5px;
	border: none;
	outline: none;
	border-radius: 100%;
	cursor: pointer;
	width: 28px;
	height: 28px;
	border-radius: 6px;
	&:hover {
		background-color: #006EFF;
		& > svg {
			color: #FFFFFF;
		}
	}
`

const TaskItemShell = styledComponents.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	${({ isSorting, isDragging }) => isDragging ? `
		z-index: 99;
	` : isSorting ? `
		z-index: -1;
	` : ``}
`

const TaskItemCore = styledComponents.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	border: 1px solid ${({ isFocused }) => isFocused ? "#006EFF" : "transparent"};
	border-radius: 10px;
	padding: 8px 12px;
	margin: 4px 0;
	overflow: hidden;
	gap: 10px;
	transition: transform 0.2s, background-color 0.2s, border-color 0.2s;
	${({ isFocused, isSorting, isDragging }) => isFocused ? `
		& ${TaskItemActions} {
			opacity: 1;
			width: auto;
		}
	` : isDragging ? `
		transform: scale(1.03);
		background-color: #EAEFEF;
	` : isSorting ? `
		opacity: 0.5;
	` : `
		&:hover {
			background-color: #EAEFEF;
			& ${TaskItemActions} {
				opacity: 1;
				width: auto;
			}
		}
	`}
	@media only screen and (max-width: 768px) {
		margin: 0;
		padding: 6px 20px;
		border: none;
		border-radius: 0;
		gap: 2px;
		background-color: ${({ isFocused }) => isFocused ? "#FFFFFF" : "transparent"};
	}
`;

const TaskItemLeftPart = styledComponents.div`
	display: flex;
	flex: 1;
	width: 100%;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	@media only screen and (max-width: 768px) {
		gap: 2px;
	}
`

const TaskItemRightPart = styledComponents.div`
	display: flex;
	flex-direction: row;
	gap: 5px;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	width: ${({ isFocused }) => isFocused ? "0px" : "170px"};
	transition: width 0.3s ease-in-out;
	@media only screen and (max-width: 768px) {
		flex-direction: column;
		gap: 2px;
		width: ${({ isFocused }) => isFocused ? "0px" : "68px"};
	}
`

const TaskItemHeader = styledComponents.span`
	font-size: 1em;
	width: 0px;
	font-weight: 400;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	cursor: text;
	flex: 1;
  text-decoration: ${({isDone}) => isDone ? "line-through" : "none"};
  color: ${({isPlaceholder}) => isPlaceholder ? "#D3D3D3" : "#222222"};
`

const TaskItemInput = styledComponents.div`
	width: 100%;
	& > input {
		background-color: transparent;
		font-size: 1em;
		width: 100%;
		padding: 0;
		margin: 0;
		font-weight: 400;
		&::placeholder {
			color: #C0C0C0;
		}
	}
`

const TaskItemDueDate = styledComponents.span`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 64px;
	color: #FFFFFF;
	font-weight: 600;
	font-size: 0.7em;
	background-color: #006EFF;
	white-space: nowrap;
    border-radius: 10px;
    padding: 3px 10px;
	@media only screen and (max-width: 768px) {
		width: 48px;
		font-size: 0.5em;
	}
`

const TaskItemOptsBtn = styledComponents.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: transparent;
	padding: 5px;
	border: none;
	outline: none;
	border-radius: 100%;
	cursor: pointer;
	width: 30px;
	height: 30px;
`

const TaskItemLeftLeftPart = styledComponents.div`
	display: flex;
	align-items: center;
	flex: 1;
	gap: 10px;
	@media only screen and (max-width: 768px) {
		justify-content: flex-start;
	}
`

const TaskItemLeftRightPart = styledComponents.div`
	display: flex;
	align-items: center;
	gap: 10px;
	@media only screen and (max-width: 768px) {
		justify-content: flex-start;
	}
`

const TaskItemStatusToggle = styledComponents.button`
	display: flex;
	align-items: center;
	justify-content: center;
	outline: none;
	border: 1px solid ${({ isDone }) => isDone ? "#006EFF" : "#222222"};
	background-color: ${({ isDone }) => isDone ? "#006EFF" : "transparent"};
	border-radius: 100%;
	width: 20px;
	height: 20px;
	min-height: 20px;
	min-width: 20px;
	padding: 2.5px;
	cursor: pointer;
`

export default connect((state) => ({
	user: state.user,
	tasks: state.tasks,
	app: state.app,
	users: state.users,
	projects: state.projects,
}))(TaskItem);
