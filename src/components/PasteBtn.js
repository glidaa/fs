import React from 'react';
import styledComponents from "styled-components"
import { connect } from "react-redux"
import * as notesActions from "../actions/notes"
import { ReactComponent as pasteIcon } from "../assets/clipboard-outline.svg"
import parseLinkedList from "../utils/parseLinkedList"
import copyNote from "../utils/copyNote"

const PasteBtn = (props) => {
  const { app, notes, dispatch } = props
  return (
    <PasteBtnCore
      width="20"
      height="20"
      strokeWidth="32"
      color="#222222"
      onClick={() => {
        const notesClipboardData = window.localStorage.getItem("notesClipboard")
        if (notesClipboardData) {
          const stringifiedNoteState = /COPIEDNOTESTART=>({.+})<=COPIEDNOTEEND/.exec(notesClipboardData)[1]
          if (stringifiedNoteState) {
            const noteState = JSON.parse(stringifiedNoteState)
            if (noteState) {
              dispatch(notesActions.handleCreateNote(
                  copyNote(
                    noteState,
                    app.selectedProject,
                    parseLinkedList(
                      notes,
                      "prevNote",
                      "nextNote"
                    ).reverse()[0]?.id
                  )
                )
              )
            }
          }
        }
      }}
    />
  )
}

const PasteBtnCore = styledComponents(pasteIcon)`
  float: right;
  border-radius: 100%;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #E4E4E2;
  }
`

export default connect((state) => ({
  user: state.user,
  notes: state.notes,
  app: state.app
}))(PasteBtn);