import React from 'react';
import styledComponents from "styled-components"
import PropTypes from 'prop-types';

export const Specials = (props) => {
  return (
    <DropdownContainer data-testid="specialsDropdown">
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
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 2px solid #000000;
  height: fit-content;
`

const Suggestion = styledComponents.div`
  cursor: pointer;
  padding: 2px 10px;
  &:hover {
    background-color: #eee;
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
