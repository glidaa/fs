import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { useDrag } from '@use-gesture/react'
import { animated, useSpring, config } from '@react-spring/web'
import * as appActions from "../actions/app"
import * as notesActions from "../actions/notes"
import copyNoteCore from "../utils/copyNote"
import { ReactComponent as RemoveIcon } from "../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../assets/duplicate-outline.svg"
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"
import { ReactComponent as DetailsIcon } from "../assets/info_black_24dp.svg";
import { ReactComponent as CheckmarkIcon } from "../assets/checkmark-circle-outline.svg";
import styledComponents from "styled-components";

const ActionSheet = (props) => {
	
	const {
		app: {
			selectedNote,
			selectedProject,
			isActionSheetOpened,
			isDetailsPanelOpened
		},
		notes,
		dispatch
	} = props

	const [{ y }, api] = useSpring(() => ({ y: 243 }))

  const openActionSheet = ({ canceled }) => {
    api.start({ y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })
  }
	
  const closeActionSheet = () => {
	dispatch(appActions.setActionSheet(false))
    api.start({ y: 243, immediate: false, config: { ...config.stiff } })
  }

  const bind = useDrag(
    ({ last, velocity: [, vy], movement: [, my], cancel, canceled }) => {
      if (my < 0) {
        cancel()
      }
      if (last) {
        my > 243 * 0.5 || vy > 0.5 ?
				closeActionSheet() :
				openActionSheet({ canceled })
      } else {
        api.start({ y: my, immediate: true })
      }
    },
    {
			from: () => [0, y.get()],
			filterTaps: true,
			bounds: { top: 0 },
			rubberband: true
		}
  )

  const display = y.to((py) => (py < 243 ? null : "none"))

	useEffect(() => {
		if (isActionSheetOpened) {
			openActionSheet({ canceled: null })
		} else {
			closeActionSheet()
		}
	}, [isActionSheetOpened])

	const copyNote = () => {
		closeActionSheet()
		window.localStorage.setItem(
			"notesClipboard",
			"COPIEDNOTESTART=>" +
			JSON.stringify(notes[selectedNote]) +
			"<=COPIEDNOTEEND"
		);
	}

	const duplicateNote = () => {
		closeActionSheet()
		dispatch(
			notesActions.handleCreateNote(
				copyNoteCore(
					notes[selectedNote],
					selectedProject,
					selectedNote,
					notes[selectedNote].nextNote
				)
			)
		);
	}

	const shareNote = () => {
		closeActionSheet()
		const linkToBeCopied = window.location.href
		navigator.clipboard.writeText(linkToBeCopied)
	}

	const removeNote = () => {
		closeActionSheet()
		dispatch(
			notesActions.handleRemoveNote(
				notes[selectedNote]
			)
		)
	}

	const openDetailsPanel = () => {
		closeActionSheet()
		if (!isDetailsPanelOpened) {
			return dispatch(appActions.handleSetDetailsPanel(true))
		}
	}

	return (
		<ActionSheetShell style={{ display }} onClick={closeActionSheet}>
				<ActionSheetContainer {...bind()} style={{ display, y }}>
				<ActionSheetHeader>Note Actions</ActionSheetHeader>
				<Actions>
					<Action onClick={copyNote}>
						<CopyIcon
							width="24"
							height="24"
							color="#222222"
							strokeWidth="32"
						/>
						<span>Copy</span>
					</Action>
					<Action onClick={duplicateNote}>
						<DuplicateIcon
							width="24"
							height="24"
							color="#222222"
							strokeWidth="32"
						/>
						<span>Duplicate</span>
					</Action>
					<Action onClick={shareNote}>
						<ShareIcon
							width="24"
							height="24"
							color="#222222"
							strokeWidth="32"
						/>
						<span>Share</span>
					</Action>
					<Action onClick={removeNote}>
						<RemoveIcon
							width="24"
							height="24"
							color="#222222"
							strokeWidth="32"
						/>
						<span>Remove</span>
					</Action>
					<Action onClick={removeNote}>
						<CheckmarkIcon
							width="24"
							height="24"
							stroke="#222222"
							strokeWidth="32"
						/>
						<span>Mark As Done</span>
					</Action>
					<Action onClick={openDetailsPanel}>
						<DetailsIcon
							width="24"
							height="24"
							color="#222222"
							strokeWidth="32"
						/>
						<span>Details</span>
					</Action>
				</Actions>
				<CloseBtn onClick={closeActionSheet}>
					Cancel
				</CloseBtn>
				</ActionSheetContainer>
		</ActionSheetShell>
	)
}

const ActionSheetShell = styledComponents(animated.div)`
	display: block;
	position: fixed;
	width: 100vw;
	height: 100vh;
	background-color: #000000AA;
	z-index: 999;
`

const ActionSheetContainer = styledComponents(animated.div)`
	position: fixed;
	display: flex;
	touch-action: none;
	flex-direction: column;
	gap: 10px;
	bottom: 0;
	width: calc(100% - 40px);
	background-color: #FFFFFF;
	padding: 20px;
	border-radius: 20px 20px 0 0;
`

const ActionSheetHeader = styledComponents.span`
	width: 100%;
	text-align: center;
	font-weight: bold;
	color: #222222;
`

const Actions = styledComponents.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	grid-column-gap: 10px;
	grid-row-gap: 10px;
`

const Action = styledComponents.button`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	border-radius: 10px;
	gap: 5px;
	font-size: 15px;
	color: #222222;
	font-weight: bold;
	padding: 15px;
	background-color: #F0F0F0;
	cursor: pointer;
	outline: none;
	border: none;
`

const CloseBtn = styledComponents.button`
	outline: none;
	border: none;
	color: #FFFFFF;
	background-color: #006EFF;
	width: 100%;
	font-weight: bold;
	padding: 10px 0;
	border-radius: 10px;
	cursor: pointer;
`

export default connect((state) => ({
  user: state.user,
  notes: state.notes,
  app: state.app,
  users: state.users,
}))(ActionSheet);