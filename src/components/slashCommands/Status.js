import React from 'react';
import styledComponents from "styled-components"
import { connect } from "react-redux";

const Status = (props) => {
  const {
    commandParam
  } = props

  return (
    <>
      {[["Todo", "#FF1744"], ["Started", "#FF9100"], ["Finished", "#00E676"]].filter(x => new RegExp(`^${commandParam || ".*"}`, "i").test(x[0])).map(x => (
        <StatusSuggestion key={x} onClick={() => props.onChooseSuggestion('/' + x)}>
            <div>
              <span style={{ color: x[1], marginRight: 10 }}>⬤</span>
              <span>{x[0]}</span>
            </div>
        </StatusSuggestion>
      ))}
    </>
  );
};

const StatusSuggestion = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  transition: background-color 0.2s;
  cursor: pointer;
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    & > span:nth-child(1) {
      font-size: 18px;
    }
    & > span:nth-child(2) {
      color: #222222;
      font-weight: 600;
      font-size: 14px;
      text-transform: lowercase;
      &::first-letter {
        text-transform: capitalize;
      }
    }
  }
  &:hover {
    background-color: #F5F5F5;
  }
`

export default connect((state) => ({
	app: state.app,
	user: state.user
}))(Status);