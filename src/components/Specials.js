import React from 'react';
import styledComponents, { keyframes } from "styled-components"
import PropTypes from 'prop-types';

export const Specials = (props) => {
  const prevNotification = () => {
    
  }
  const nextNotification = () => {

  }
  return (
    <DropdownContainer data-testid="specialsDropdown">
      <Notifications>
        <span onClick={prevNotification}>{"<"}</span>
        <span>{"@Sue assigned task"}</span>
        <span onClick={nextNotification}>{">"}</span>
      </Notifications>
      {props.suggestionsList.map((x, i) => (
        props.suggestionsCondition[i] ? (
        <Suggestion key={x} onClick={() => props.onChooseSuggestion('/' + x)}>
            <b>/{x}</b> - {props.suggestionsDescription[i]}
        </Suggestion>
        ) : null
      ))}
    </DropdownContainer>
  );
};

const openAnim = keyframes`
  from {
    height: 0;
  }

  to {
    height: 355px;
  }
`;

const DropdownContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
  overflow: hidden;
  background-color: #FFFFFF;
  z-index: 999;
  border-radius: 10px;
  border: none;
  padding: 15px;
  box-shadow: rgb(149 157 165 / 20%) 0px 8px 24px;
  height: fit-content;
  animation: ${openAnim} 0.3s ease;
`

const Notifications = styledComponents.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  & > span:nth-child(1), & > span:nth-child(3) {
    cursor: pointer;
  }
`

const Suggestion = styledComponents.div`
  cursor: pointer;
  color: #505172;
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #F5F5F5;
  }
`

Specials.propTypes = {
  onChooseSuggestion: PropTypes.func.isRequired,
  suggestionsList: PropTypes.array.isRequired,
  suggestionsCondition: PropTypes.array.isRequired,
  suggestionsDescription:  PropTypes.array.isRequired
};

Specials.defaultProps = {
  onChooseSuggestion: null,
  suggestionsList: [
    "s",
    "l",
    "x",
    "q"
  ],
  suggestionsCondition: [
    true,
    true,
    true,
    false
  ],
  suggestionsDescription: [
    "Login to save your tasks",
    "Create a new account",
    "Mark this task as done",
    "Logout"
  ],
};
