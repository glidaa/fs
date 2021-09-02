import React, { useState, useRef, useEffect } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useOuterClick } from 'react-outer-click';
import styledComponents from "styled-components"
import formatDate from '../utils/formatDate';

export const DatePicker = (props) => {
  const { readOnly } = props
  const selectRef = useRef(null)
  const [isPickerOpened, setIsPickerOpened] = useState(false)
  const togglePicker = () => {
    if (!readOnly) {
      setIsPickerOpened(isPickerOpened ? false : true)
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
        name={props.name}
        value={formatDate(props.value)}
        placeholder={props.placeholder}
        contentEditable={false}
        onClick={togglePicker}
        readOnly
      />
      {isPickerOpened && <Calendar>
        <DayPicker 
          onDayClick={(day) => {
            togglePicker()
              props.onChange({ target: {
                value: day.getTime(),
                name: props.name
              }})
            }
          }
        />
      </Calendar>}
    </DatePickerContainer>
  );
};

const DatePickerContainer = styledComponents.div`
  width: calc(100% - 20px);
  height: 28px;
  & > input {
    padding: 5px 10px;
    border: 1px solid #C0C0C0;
    border-radius: 8px;
    width: 100%;
    color: transparent;
    text-shadow: 0 0 0 #222222;
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