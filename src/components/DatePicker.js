import React, { useState, useRef, useEffect } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useOuterClick } from 'react-outer-click';
import styledComponents from "styled-components"
import { ReactComponent as RemoveIcon } from "../assets/close-outline.svg"
import formatDate from '../utils/formatDate';

export const DatePicker = (props) => {
  const {
    name,
    value,
    placeholder,
    onChange,
    readOnly
  } = props
  const selectRef = useRef(null)
  const [isPickerOpened, setIsPickerOpened] = useState(false)
  const clearValue = () => {
    if (!readOnly) onChange({ target: { value: null, name: name }})
  }
  const togglePicker = () => {
    if (!readOnly) {
      setIsPickerOpened(isPickerOpened ? false : true)
    }
  }
  const selectValue = (day) => {
    if (!readOnly) {
      togglePicker()
      onChange({ target: { value: day.getTime(), name: name }})
    }
  }
  useOuterClick(selectRef, () => {
    if (isPickerOpened) {
      setIsPickerOpened(false);
    }
  })
  useEffect(() => {
    if (readOnly && isPickerOpened) {
      setIsPickerOpened(false)
    }
  }, [readOnly, isPickerOpened, setIsPickerOpened])
  return (
    <DatePickerContainer ref={selectRef} readOnly={readOnly}>
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
        <Calendar>
          <DayPicker onDayClick={selectValue} />
        </Calendar>
      )}
    </DatePickerContainer>
  );
};

const DatePickerContainer = styledComponents.div`
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
const Calendar = styledComponents.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  width: fit-content;
  & > div.DayPicker {
    font-size: 12px;
  }
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
`

const ClearBtn = styledComponents.button`
  outline: none;
  border: none;
  background-color: transparent;
  line-height: 0;
  cursor: pointer;
`