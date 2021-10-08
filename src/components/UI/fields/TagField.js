import React, { useState, useRef } from 'react';
import { useOuterClick } from 'react-outer-click';
import styled from "styled-components"
import { glassmorphism } from '../../../styles';

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
  gap: 5px;
  & > label {
    color: #000000;
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
`

const TagFieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: 100%;
`

const NewTagBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: var(--primary);
  font-size: 20px;
  outline: none;
  width: 33px;
  height: 33px;
  font-weight: 500;
  line-height: 0;
  padding: 0;
  cursor: pointer;
  ${glassmorphism(8)}
  border: none;
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
  background-color: var(--primary);
  outline: none;
  width: fit-content;
  height: fit-content;
  border: 1px solid var(--primary);
`

const TagItem = styled.span`
  display: inline-flex;
  gap: 5px;
  padding: 5px 10px;
  font-weight: 600;
  font-size: 14px;
  width: fit-content;
  height: fit-content;
  color: #5D6969;
  ${glassmorphism(8)}
  border: none;
  flex-direction: row;
  align-items: center;
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
`

const TagInput = styled.span`
  display: inline-flex;
  padding: 5px 10px;
  width: 60px;
  border: none;
  ${glassmorphism(8)}
  & > input {
    border: none;
    width: 60px;
    color: #5D6969;
    font-size: 14px;
    font-weight: 600;
    padding: 0;
    background-color: transparent;
    &::placeholder {
      color: #939393;
    }
  }
`

export default TagField