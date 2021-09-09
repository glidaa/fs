import React from 'react';
import styledComponents from "styled-components"
import {  useToasts } from 'react-toast-notifications'

export const Tag = (props) => {
  const { readOnly } = props
  const { addToast } = useToasts();
  const handleTagClick = (e) => {
    const tag = e.target.innerText;
  }
  return (
    <TagContainer>
      {props.value.map(x => (
        <TagItem key={x}>
          <span onClick={handleTagClick } >{x}</span>
          <span onClick={() => {
            const tagsSet = new Set(props.value || [])
            tagsSet.delete(x)
            props.onChange({ target: {
              value: Array.from(tagsSet),
              name: props.name
            }})
          }}>
            ×
          </span>
        </TagItem>
      ))}
      {!readOnly && <TagInput>
      <input
        placeholder="tag…"
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            const tagsSet = new Set(props.value || [])
            tagsSet.add(e.target.value)
            e.target.value = ""
            props.onChange({ target: {
              value: Array.from(tagsSet),
              name: props.name
            }}), addToast(`tagged something`, {appereance: 'info'})
          }
      }} />
    </TagInput>}
    </TagContainer>
  )
}

const TagContainer = styledComponents.div`
  display: block;
  width: 50%;
`
const TagItem = styledComponents.span`
  padding: 4px 8px;
  gap: 5px;
  border-radius: 4px;
  width: fit-content;
  height: fit-content;
  font-size: 12px;
  border: 1px solid #d9d9d9;
  background-color: #fafafa;
  margin: 2px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  & > span {
    cursor: pointer;
    &:nth-child(1) {
      text-decoration: underline;
    }
    &:nth-child(2) {
      border-radius: 100%;
      height: 12px;
      width: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: grey;
        color: #FFFFFF;
      }
    }
  }
`

const TagInput = styledComponents.span`
  padding: 4px 8px;
  border-radius: 4px;
  width: calc(50px - 16px);
  height: fit-content;
  font-size: 12px;
  border: 1px solid #d9d9d9;
  background-color: #fafafa;
  margin: 2px;
  & > input {
    border: none;
    width: 50px;
    background-color: #fafafa;
  }
`
