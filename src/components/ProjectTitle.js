import React from 'react';
import styledComponents from "styled-components";
import { connect } from "react-redux";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import { initTaskState, OK } from '../constants';
import parseLinkedList from '../utils/parseLinkedList';

const ProjectTitle = (props) => {

	const {
		app: {
			isProjectTitleSelected,
			selectedProject,
			taskAddingStatus
		},
		projects: {
			owned,
			assigned
		},
		tasks,
		readOnly,
		dispatch
	} = props;

	const onChange = (e) => {
		dispatch(projectsActions.handleUpdateProject({
			id: selectedProject,
			title: e.target.value
		}))
	};

	const onKeyUp = (e) => {
		const firstTask = parseLinkedList(tasks, "prevTask", "nextTask")[0]?.id
		if (e.key === "Enter") {
			if (Object.keys(owned).includes(selectedProject)) {
				if (taskAddingStatus === OK) {
					appActions.handleSetProjectTitle(false)
					dispatch(
						tasksActions.handleCreateTask(
							initTaskState(
								selectedProject,
								null,
								firstTask
							)
						)
					)
				}
			}
		} else if (e.key === "ArrowDown") {
			dispatch(appActions.handleSetProjectTitle(false))
			if (firstTask) {
				return dispatch(appActions.handleSetTask(firstTask))
			}
		} else if (e.key === "Escape") {
			return dispatch(appActions.handleSetProjectTitle(false))
		}
	};

	const selectTitle = () => {
		dispatch(appActions.handleSetProjectTitle(true))
	}

	return (
		<ProjectTitleShell>
			{isProjectTitleSelected ? (
				<ProjectTitleInput>
					<input
						type="text"
						placeholder="Project Title…"
						value={{ ...owned, ...assigned }[selectedProject].title}
						onKeyUp={onKeyUp}
						onChange={onChange}
						autoFocus={true}
						contentEditable={false}
						readOnly={readOnly}
					/>
				</ProjectTitleInput>
			) : (
				<ProjectTitleHeader
					className={{ ...owned, ...assigned }[selectedProject].title ? null : "placeholder"}
					onClick={selectTitle}
				>
					{{ ...owned, ...assigned }[selectedProject].title || "Project Title…"}
				</ProjectTitleHeader>
			)}
		</ProjectTitleShell>
	);
};

const ProjectTitleShell = styledComponents.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`

const ProjectTitleHeader = styledComponents.span`
	font-weight: 600;
	margin: 4px 0;
	padding: 8px 12px;
	font-size: 2em;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	cursor: text;
	color: #596766;
	&.placeholder {
		color: #D3D3D3;
	}
	@media only screen and (max-width: 768px) {
		padding: 15px 20px 15px 20px;
		font-size: 22px;
	}
`

const ProjectTitleInput = styledComponents.div`
	width: 100%;
	margin: 4px 0;
	padding: 8px 12px;
	& > input {
		background-color: transparent;
		color: #596766;
		font-size: 2em;
		width: 100%;
		font-weight: 600;
		padding: 0;
		margin: 0;
		border: none;
		outline: none;
		&::placeholder {
			color: #C0C0C0;
		}
	}
	@media only screen and (max-width: 768px) {
		padding: 15px 20px 15px 20px;
		width: calc(100% - 40px);
		& > input {
			font-size: 22px;
		}
	}
`

export default connect((state) => ({
	tasks: state.tasks,
	app: state.app,
	projects: state.projects,
}))(ProjectTitle);
