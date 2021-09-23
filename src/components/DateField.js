import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from "react-modern-calendar-datepicker";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import styledComponents from "styled-components"
import { ReactComponent as RemoveIcon } from "../assets/close-outline.svg"
import formatDate from '../utils/formatDate';

const DateField = (props) => {
  const {
    name,
    value,
    placeholder,
    onChange,
    readOnly
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
    <DateFieldContainer readOnly={readOnly}>
      <input
        name={name}
        value={value ? formatDate(value) : ""}
        placeholder={placeholder}
        contentEditable={false}
        onClick={togglePicker}
        readOnly
      />  
      {value && (
        <ClearBtn onClick={clearValue}>
          <RemoveIcon
            height="16"
            width="16"
            strokeWidth="32"
            color="#222222"
          />
        </ClearBtn>
      )}
      {isPickerOpened && (
        <PickerContainer onClick={handleOverlayClick}>
          <Calendar
            value={pickerValue}
            onChange={pickValue}
            colorPrimary="#006EFF"
            colorPrimaryLight="#338bff"
            shouldHighlightWeekends
          />
        </PickerContainer>
      )}
    </DateFieldContainer>
  );
};

const DateFieldContainer = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 20px);
  padding: 5px 10px;
  border: 1px solid #C0C0C0;
  border-radius: 8px;
  & > input {
    flex: 1;
    padding: 0;
    border: none;
    color: #222222;
    background-color: transparent;
    cursor: ${({readOnly}) => readOnly ? "default" : "pointer"};
    transition: border 0.3s, box-shadow 0.3s;
    font-size: 14px;
    font-weight: 400;
    &::placeholder {
      color: #C0C0C0;
    }
  }
`

const PickerContainer = styledComponents.div`
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
`

const ClearBtn = styledComponents.button`
  outline: none;
  border: none;
  background-color: transparent;
  line-height: 0;
  cursor: pointer;
`

export default DateField