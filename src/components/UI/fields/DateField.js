import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from "react-dom"
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import styled from "styled-components"
import { ReactComponent as RemoveIcon } from "../../../assets/close-outline.svg"
import formatDate from '../../../utils/formatDate';
import { glassmorphism } from '../../../styles';

const BodyOverlay = ({ children }) => createPortal(children, window.document.querySelector("body"))

const DateField = (props) => {
  const {
    name,
    value = null,
    placeholder,
    onChange,
    readOnly,
    error,
    label,
    style,
    clearable
  } = props
  const [isPickerOpened, setIsPickerOpened] = useState(false)
  const clearValue = () => {
    if (!readOnly) onChange({ target: { value: null, name: name }})
  }
  const togglePicker = () => {
    if (!readOnly) {
      setIsPickerOpened(isPickerOpened ? false : true)
    }
  }
  const pickValue = ({ day, month, year }) => {
    if (!readOnly) {
      togglePicker()
      onChange({ target: { value: new Date(`${month}-${day}-${year}`).getTime(), name: name }})
    }
  }
  const getPickerValue = (value) => {
    if (!value) return null
    const dateObj = new Date(value)
    const day = dateObj.getDate()
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()
    return { day, month, year }
  }
  const pickerValue = useMemo(() => getPickerValue(value), [value])
  const handleOverlayClick = (e) => {
    e.stopPropagation()
    if (e.target === e.currentTarget) {
      setIsPickerOpened(false)
    }
  }
  useEffect(() => {
    if (readOnly && isPickerOpened) {
      setIsPickerOpened(false)
    }
  }, [readOnly, isPickerOpened, setIsPickerOpened])
  return (
    <DateFieldShell style={style}>
      <label htmlFor={name}>
        {label}
      </label>
      <DateFieldContainer readOnly={readOnly} isError={error}>
        <input
          name={name}
          value={value ? formatDate(value) : ""}
          placeholder={placeholder}
          contentEditable={false}
          onClick={togglePicker}
          readOnly
        />  
        {clearable && value && (
          <ClearBtn onClick={clearValue}>
            <RemoveIcon
              height="16"
              width="16"
              strokeWidth="32"
              color="#000000"
            />
          </ClearBtn>
        )}
        <BodyOverlay>
          {isPickerOpened && (
            <PickerContainer onClick={handleOverlayClick}>
              <Calendar
                value={pickerValue}
                onChange={pickValue}
                colorPrimary="var(--primary)"
                colorPrimaryLight="var(--primary-disabled)"
                shouldHighlightWeekends
              />
            </PickerContainer>
          )}
        </BodyOverlay>
      </DateFieldContainer>
      {error && <span>{error}</span>}
    </DateFieldShell>
  );
};

const DateFieldShell = styled.div`
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
  & > span {
    color: #FF0000;
    font-size: 12px;
  }
`

const DateFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 20px);
  padding: 5px 10px;
  border: none;
  ${glassmorphism(8)}
  /* border: 1px solid ${({isError}) => isError ? "#FF0000" : "#939393"}; */
  & > input {
    flex: 1;
    padding: 0;
    border: none;
    color: #000000;
    background-color: transparent;
    cursor: ${({readOnly}) => readOnly ? "default" : "pointer"};
    transition: border 0.3s, box-shadow 0.3s;
    font-size: 14px;
    font-weight: 400;
    &::placeholder {
      color: #939393;
    }
  }
`

const PickerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000000AA;
  z-index: 9999;
  div.Calendar {
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    background-color: rgba(255, 255, 255, 0.75);
    box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
    border: none;
  }
`

const ClearBtn = styled.button`
  outline: none;
  border: none;
  background-color: transparent;
  line-height: 0;
  cursor: pointer;
`

export default DateField