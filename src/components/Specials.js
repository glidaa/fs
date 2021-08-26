import React, { useMemo } from 'react';
import styledComponents, { keyframes } from "styled-components"
import { connect } from "react-redux";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { supportedCommands } from "../constants"
import slashCommands from "./slashCommands"

const Specials = (props) => {
  const {
    app: {
      command
    },
    posInfo
  } = props

  const supportedIntents = Object.keys(supportedCommands)

  const tokenizeCommand = (command) => {
    const tokens =  /^\/(\w*\s{0,1})\s*(.*)\s*$/m.exec(command)
    const commandIntent = supportedIntents.map(x => `${x} `).includes(tokens[1].toUpperCase()) ? tokens[1].slice(0, -1).toUpperCase() : "COMMANDS"
    const commandParam = tokens[2] ? tokens[2].trim() : null
    return [commandIntent, commandParam]
  }

  const [commandIntent, commandParam] = useMemo(() => tokenizeCommand(command), [command])

  return (
    <>
      {slashCommands[commandIntent] && (
        <DropdownContainer $posInfo={posInfo}>
          {React.createElement(slashCommands[commandIntent], {commandIntent, commandParam})}
        </DropdownContainer>
      )}
    </>
  );
};

const openAnim = keyframes`
  from {
    height: 0;
  }

  to {
    height: 300px;
  }
`;

const DropdownContainer = styledComponents(SimpleBar)`
  position: fixed;
  top: ${({ $posInfo }) => $posInfo.top}px;
  left: ${({ $posInfo }) => $posInfo.left}px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #FFFFFF;
  z-index: 999;
  border-radius: 10px;
  border: none;
  padding: 15px 0;
  box-shadow: rgb(149 157 165 / 20%) 0px 8px 24px;
  width: 320px;
  max-height: 300px;
  animation: ${openAnim} 0.3s ease;
  @media only screen and (max-width: 768px) {
    left: 0;
    max-height: 200px;
    width: 100vw;
    border-radius: 0px;
    box-shadow: none;
  }
`

export default connect((state) => ({
	app: state.app,
	user: state.user
}))(Specials);