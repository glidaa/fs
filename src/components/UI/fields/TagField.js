import React, { useState, useRef } from 'react';
import { useOuterClick } from 'react-outer-click';
import styled from "styled-components"

const TagField = (props) => {
  const {
    name,
    value = [],
    onChange,
    readOnly,
    label,
    placeholder,
    style
  } = props
  const tagFieldRef = useRef(null)
  const tagFieldInputRef = useRef(null)
  const [isEntering, setIsEntering] = useState(false)

  const handleTagClick = (e) => {
    const tag = e.target.innerText;
  }

  const handleTagInput = (e) => {
    if (e.code === "Enter" && e.target.value.trim()) {
      const tagsSet = new Set(value || [])
      tagsSet.add(e.target.value.trim())
      e.target.value = ""
      onChange({ target: {
        value: Array.from(tagsSet),
        name: name
      }})
    }
}

  useOuterClick(tagFieldRef, () => {
    if (isEntering && !tagFieldInputRef.current.value.trim()) {
      setIsEntering(false);
    }
  })

  return (
    <TagFieldShell style={style}>
      <label htmlFor={name}>
        {label}
      </label>
      <TagFieldContainer ref={tagFieldRef}>
        {!readOnly && <NewTagBtn onClick={() => setIsEntering(true)}>+</NewTagBtn>}
        {(value.length || isEntering) ? value.map(x => (
          <TagItem key={x}>
            <span onClick={handleTagClick}>{x}</span>
            <span onClick={() => {
              const tagsSet = new Set(value || [])
              tagsSet.delete(x)
              onChange({ target: {
                value: Array.from(tagsSet),
                name: name
              }})
            }}>
              ×
            </span>
          </TagItem>
        )) : (
          <NoTags>No tags added 😢</NoTags>
        )}
        {(!readOnly && isEntering) && (
          <TagInput>
            <input
              ref={tagFieldInputRef}
              placeholder={placeholder}
              autoFocus
              onKeyDown={handleTagInput}
            />
          </TagInput>
        )}
      </TagFieldContainer>
    </TagFieldShell>
  )
}

const TagFieldShell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`

const TagFieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  & > *:not(:last-child) {
    margin-right: 5px;
  }
`

const NewTagBtn = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: ${({theme})=> theme.primary};
  font-size: 20px;
  outline: none;
  width: 33px;
  height: 33px;
  font-weight: 500;
  line-height: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid ${({theme})=> theme.primary};
  background-color: #FFFFFF;
`

const NoTags = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #FFFFFF;
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  background-color: ${({theme})=> theme.primary};
  outline: none;
  width: fit-content;
  height: fit-content;
  border: 1px solid ${({theme})=> theme.primary};
`

const TagItem = styled.span`
  position: relative;
  display: inline-flex;
  padding: 5px 10px;
  font-weight: 600;
  font-size: 14px;
  width: fit-content;
  height: fit-content;
  color: #5D6969;
  border-radius: 8px;
  border: none;
  flex-direction: row;
  align-items: center;
  border: 1px solid #C0C0C0;
  & > span {
    cursor: pointer;
    &:nth-child(1) {
      &:hover {
        text-decoration: underline;
      }
    }
    &:nth-child(2) {
      border-radius: 100%;
      height: 12px;
      width: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
  & > *:not(:last-child) {
    margin-right: 5px;
  }
`

const TagInput = styled.span`
  position: relative;
  display: inline-flex;
  padding: 5px 10px;
  width: 60px;
  border: none;
  border-radius: 8px;
  border: 1px solid #C0C0C0;
  & > input {
    border: none;
    width: 60px;
    color: #5D6969;
    font-size: 14px;
    font-weight: 600;
    padding: 0;
    background-color: transparent;
    &::placeholder {
      color: #C0C0C0;
    }
  }
`

export default TagField