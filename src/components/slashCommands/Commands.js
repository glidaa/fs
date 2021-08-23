import React from 'react';
import styledComponents from "styled-components"
import { connect } from "react-redux";
import { supportedCommands } from "../../constants"
import { ReactComponent as AssignIcon } from "../../assets/person-add-outline.svg"
import { ReactComponent as CalenderIcon } from "../../assets/calendar-outline.svg"
import { ReactComponent as TagsIcon } from "../../assets/pricetags-outline.svg"
import { ReactComponent as DescriptionIcon } from "../../assets/receipt-outline.svg"
import { ReactComponent as StatusIcon } from "../../assets/checkbox-outline.svg"
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../../assets/duplicate-outline.svg"
import { ReactComponent as ReorderIcon } from "../../assets/reorder-four-outline.svg"

const Commands = (props) => {
  const {
    app: {
      command
    }
  } = props

  const supportedIntents = Object.keys(supportedCommands)

  return (
    <>
      {supportedIntents.filter(x => new RegExp(`^${/^\/(\w*)\s*(.*)\s*$/m.exec(command)[1]}`, "i").test(x)).map(x => (
        <CommandSuggestion key={x} onClick={() => props.onChooseSuggestion('/' + x)}>
            {x === "ASSIGN" && <AssignIcon color="#006EFF" strokeWidth="32" height={24} />}
            {x === "DUE" && <CalenderIcon color="#006EFF" fill="#006EFF" strokeWidth="32" height={24} />}
            {x === "TAGS" && <TagsIcon color="#006EFF" strokeWidth="32" height={24} />}
            {x === "DESCRIPTION" && <DescriptionIcon color="#006EFF" strokeWidth="32" height={24} />}
            {x === "STATUS" && <StatusIcon color="#006EFF" strokeWidth="32" height={24} />}
            {x === "DELETE" && <RemoveIcon color="#006EFF" strokeWidth="32" height={24} />}
            {x === "COPY" && <CopyIcon color="#006EFF" strokeWidth="32" height={24} />}
            {x === "DUPLICATE" && <DuplicateIcon color="#006EFF" strokeWidth="32" height={24} />}
            {x === "REORDER" && <ReorderIcon color="#006EFF" strokeWidth="32" height={24} />}
            <div>
              <span>{x}</span>
              <span>{supportedCommands[x].description}</span>
            </div>
        </CommandSuggestion>
      ))}
    </>
  );
};

const CommandSuggestion = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  transition: background-color 0.2s;
  cursor: pointer;
  & > div {
    display: flex;
    flex-direction: column;
    & > span:nth-child(1) {
      color: #222222;
      font-weight: 600;
      font-size: 14px;
      text-transform: lowercase;
      &::first-letter {
        text-transform: capitalize;
      }
    }
    & > span:nth-child(2) {
      color: #222222;
      font-weight: 400;
      font-size: 12px;
    }
  }
  &:hover {
    background-color: #F5F5F5;
  }
`

export default connect((state) => ({
	app: state.app
}))(Commands);