import React from 'react';
import styledComponents from "styled-components"
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

const DropdownContainer = styledComponents.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: fit-content;
  border: 0.5px solid #000000;
  background-color: #FFFFFF;
  z-index: 999;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
  height: fit-content;
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
  padding: 2px 10px;
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
    "Mark this note as done",
    "Logout"
  ],
};
