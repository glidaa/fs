import React from 'react';
import styled from "styled-components";
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
		projects,
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
						value={projects[selectedProject].title || ""}
						onKeyUp={onKeyUp}
						onChange={onChange}
						autoFocus={true}
						readOnly={readOnly}
					/>
				</ProjectTitleInput>
			) : (
				<ProjectTitleHeader
					className={projects[selectedProject].title ? null : "placeholder"}
					onClick={selectTitle}
				>
					{projects[selectedProject].title || "Project Title…"}
				</ProjectTitleHeader>
			)}
		</ProjectTitleShell>
	);
};

const ProjectTitleShell = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`

const ProjectTitleHeader = styled.span`
	font-weight: 600;
	margin: 4px 0;
	padding: 8px 12px;
	font-size: 32px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	cursor: text;
	color: #000000;
	&.placeholder {
		color: #D3D3D3;
	}
	@media only screen and (max-width: 768px) {
		padding: 5px 20px 5px 20px;
		font-size: 22px;
	}
`

const ProjectTitleInput = styled.div`
	width: 100%;
	margin: 4px 0;
	padding: 8px 12px;
	& > input {
		background-color: transparent;
		color: #000000;
		font-size: 32px;
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
