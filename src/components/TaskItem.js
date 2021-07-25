import React, { forwardRef } from "react"
import styledComponents from "styled-components";
import { connect } from "react-redux";
import useWindowSize from "../utils/useWindowSize";
import formatDate from "../utils/formatDate"
import copyNoteCore from "../utils/copyNote"
import * as appActions from "../actions/app";
import * as notesActions from "../actions/notes";
import { AuthState } from "@aws-amplify/ui-components";
import { ReactComponent as CheckmarkIcon } from "../assets/checkmark-circle-outline.svg";
import { ReactComponent as OptionsIcon } from "../assets/ellipsis-vertical.svg";
import { ReactComponent as RemoveIcon } from "../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../assets/duplicate-outline.svg"
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"
import { ReactComponent as DetailsIcon } from "../assets/info_black_24dp.svg";
import { Specials } from "./Specials";
import {
	suggestionsList,
	suggestionsDescription,
	NOT_ASSIGNED,
	OK,
	initNoteState,
} from "../constants";
import AvatarArray from "./AvatarArray";

const TaskItem = (props) => {

	const {
		users,
		item,
		user,
		notes,
		projects,
		app: {
			selectedNote,
			selectedProject,
			noteAddingStatus,
			isDropdownOpened,
			isDetailsPanelOpened,
			command
		},
		readOnly,
		listeners,
		isSorting,
		isDragging,
		dispatch
	} = props;

	const { width } = useWindowSize();

	const onChange = (e) => {
		dispatch(
			notesActions.handleUpdateNote({
				id: selectedNote,
				note: e.target.value,
			})
		);
	};

	const toggleStatus = (item) => {
		dispatch(
			notesActions.handleUpdateNote({
				id: item.id,
				isDone: !item.isDone,
			})
		);
	};

	const onKeyUp = (e) => {
		if (e.key === "Enter" && e.shiftKey) {
			if (Object.keys(projects.owned).includes(selectedProject)) {
				if (noteAddingStatus === OK) {
					dispatch(
						notesActions.handleCreateNote(
							initNoteState(
								selectedProject,
								selectedNote,
								notes[selectedNote].nextNote
							)
						)
					);
				}
			}
		} else if (e.key === "ArrowUp") {
			const prevNote = notes[selectedNote].prevNote
			if (!prevNote) {
				return dispatch(appActions.handleSetProjectTitle(true))
			} else {
				dispatch(appActions.handleSetNote(prevNote))
			}
		} else if (e.key === "ArrowDown") {
			const nextNote = notes[selectedNote].nextNote
			if (nextNote) {
				return dispatch(appActions.handleSetNote(nextNote))
			}
		} else if (e.key === "Enter" && command) {
			return dispatch(appActions.handleApplyCommand())
		} else if (e.key === "Escape" || e.key === "Enter") {
			return dispatch(appActions.handleSetNote(null))
		}
	};

	const onChooseSuggestion = (suggestion) =>
		dispatch(
			notesActions.handleUpdateNote({
				id: selectedNote,
				note: notes[selectedNote] + suggestion,
			})
		);

	const openActionSheet = (item) => {
		dispatch(
			appActions.handleSetNote(item.id)
		)
		dispatch(
			appActions.setActionSheet(true)
		)
	}

	const selectItem = (item) => {
		if (!readOnly) {
			return dispatch(appActions.handleSetNote(item.id))
		}
	}

	const openDetailsPanel = (item) => {
		if (!isDetailsPanelOpened) {
			if (item.id !== selectedNote) {
				dispatch(appActions.handleSetNote(item.id))
			}
			return dispatch(appActions.handleSetDetailsPanel(true))
		}
	}

	const copyNote = (item) => {
		window.localStorage.setItem(
			"notesClipboard",
			"COPIEDNOTESTART=>" +
			JSON.stringify(item) +
			"<=COPIEDNOTEEND"
		);
	}

	const duplicateNote = (item) => {
		dispatch(
			notesActions.handleCreateNote(
				copyNoteCore(
					item,
					selectedProject,
					item.id,
					item.nextNote
				)
			)
		);
	}

	const shareNote = () => {
		const linkToBeCopied = window.location.href
		navigator.clipboard.writeText(linkToBeCopied)
	}

	const removeNote = (item) => {
		dispatch(notesActions.handleRemoveNote(item))
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
				isFocused={item.id === selectedNote}
			>
				<TaskItemLeftPart>
					<TaskItemLeftLeftPart>
						{width < 768 ?
							<TaskItemStatus isDone={item.isDone}>
								⬤
							</TaskItemStatus> :
							<TaskItemStatusToggle onClick={() => toggleStatus(item)}>
								<CheckmarkIcon
									stroke={item.isDone ? "#00E676" : "#FF3D00"}
									strokeWidth="32"
									width="24"
									height="24"
							/>
							</TaskItemStatusToggle>
						}
						{selectedNote === item.id ? (
							<TaskItemInput>
								<input
									type="text"
									data-testid="updateTaskField"
									className="task"
									placeholder="Note…"
									value={notes[selectedNote].task + command}
									onKeyUp={onKeyUp}
									onChange={onChange}
									autoFocus={true}
									contentEditable={false}
									readOnly={readOnly}
								/>
							</TaskItemInput>
						) : (
							<TaskItemHeader
								className={item.task ? null : "placeholder"}
								onClick={() => selectItem(item)}
							>
								{item.isDone ? <strike>{item.task}</strike> : item.task || "Note…"}
							</TaskItemHeader>
						)}
					</TaskItemLeftLeftPart>
					<TaskItemLeftRightPart>
						{width > 768 ?
						<TaskItemActions>
							<TaskItemAction onClick={() => copyNote(item)}>
								<CopyIcon
									height="18"
									strokeWidth="34"
									color="#006EFF"
								/>
							</TaskItemAction>
							<TaskItemAction onClick={() => duplicateNote(item)}>
								<DuplicateIcon
									height="18"
									strokeWidth="34"
									color="#006EFF"
								/>
							</TaskItemAction>
							<TaskItemAction onClick={() => shareNote(item)}>
								<ShareIcon
									height="18"
									strokeWidth="34"
									color="#006EFF"
								/>
							</TaskItemAction>
							<TaskItemAction onClick={() => removeNote(item)}>
								<RemoveIcon
									height="18"
									strokeWidth="34"
									color="#006EFF"
								/>
							</TaskItemAction>
							<TaskItemAction onClick={() => openDetailsPanel(item)}>
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
				<TaskItemRightPart isFocused={item.id === selectedNote}>
					<TaskItemDueDate>
						{formatDate(item.due)}
					</TaskItemDueDate>
					<AvatarArray borderColor="#F8F8F8" size={ width > 768 ? "24" : "18" } />
				</TaskItemRightPart>
			</TaskItemCore>
			{(isDropdownOpened && selectedNote === item.id) && (
				<Specials
					onChooseSuggestion={onChooseSuggestion}
					suggestionsList={suggestionsList}
					suggestionsCondition={[
						user.state !== AuthState.SignedIn,
						user.state !== AuthState.SignedIn,
						true,
						true,
						true,
						true,
						user.state === AuthState.SignedIn,
					]}
					suggestionsDescription={suggestionsDescription}
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
	width: ${({ isFocused }) => isFocused ? "0px" : "150px"};
	transition: width 0.3s ease-in-out;
	@media only screen and (max-width: 768px) {
		flex-direction: column;
		gap: 2px;
		width: ${({ isFocused }) => isFocused ? "0px" : "62px"};
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
	&.placeholder {
		color: #D3D3D3;
	}
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

const TaskItemStatus = styledComponents.span`
	color: ${({ isDone }) => isDone ? "#00E676" : "#FF3D00"};
`

const TaskItemDueDate = styledComponents.span`
	display: flex;
	justify-content: center;
	align-items: center;
	width: fit-content;
	color: #FFFFFF;
	font-weight: 600;
	font-size: 0.7em;
	background-color: #006EFF;
	white-space: nowrap;
    border-radius: 10px;
    padding: 3px 10px;
	@media only screen and (max-width: 768px) {
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
	border:none;
	background-color: transparent;
	padding: 0;
	cursor: pointer;
`

export default connect((state) => ({
	user: state.user,
	notes: state.notes,
	projects: state.projects,
	app: state.app,
	users: state.users,
}))(TaskItem);
