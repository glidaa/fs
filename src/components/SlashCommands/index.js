import React, { useMemo, createRef } from 'react';
import styles from "./index.module.scss"
import { connect } from "react-redux";
import SimpleBar from 'simplebar-react';
import { supportedCommands } from "../../constants"
import ASSIGN from "./Assign"
import COMMANDS from "./Commands"
import STATUS from "./Status"
import TAGS from "./Tags"
import DUE from "./Due"
import DESCRIPTION from "./Description"

const slashCommandsPages = {
  ASSIGN,
  COMMANDS,
  STATUS,
  TAGS,
  DUE,
  DESCRIPTION
}

const SlashCommands = (props) => {
  const {
    app: {
      command
    },
    posInfo
  } = props

  const supportedIntents = Object.keys(supportedCommands)
  const scrollableNodeRef = createRef()

  const tokenizeCommand = (command) => {
    const tokens =  /^\/(\w*\s{0,1})\s*(.*)\s*$/m.exec(command)
    const commandIntent = supportedIntents.map(x => `${x} `).includes(tokens[1].toUpperCase()) ? tokens[1].slice(0, -1).toUpperCase() : "COMMANDS"
    const commandParam = tokens[2] ? tokens[2].trim() : null
    return [commandIntent, commandParam]
  }

  const [commandIntent, commandParam] = useMemo(() => tokenizeCommand(command), [command])

  return slashCommandsPages[commandIntent] && (
    <SimpleBar
      className={styles.DropdownContainer}
      style={{
        top: posInfo.top,
        left: posInfo.posInfo
      }}
      scrollableNodeProps={{ ref: scrollableNodeRef }}
    >
      {React.createElement(slashCommandsPages[commandIntent], {commandIntent, commandParam, scrollableNodeRef })}
    </SimpleBar>
  )
}

export default connect((state) => ({
	app: state.app,
	user: state.user
}))(SlashCommands);