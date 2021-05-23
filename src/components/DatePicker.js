import React, { useState, useRef } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useOuterClick } from 'react-outer-click';
import styledComponents from "styled-components"

export const DatePicker = (props) => {
  const selectRef = useRef(null)
  const [isPickerOpened, setIsPickerOpened] = useState(false)
  const togglePicker = (e) => {
    setIsPickerOpened(isPickerOpened ? false : true)
  }
  useOuterClick(selectRef, () => {
    if (isPickerOpened) {
      setIsPickerOpened(false);
    }
  })
  return (
    <DatePickerContainer ref={selectRef}>
      <input
        name={props.name}
        value={new Date(props.value).toLocaleDateString()}
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
  width: 120px;
  height: 28px;
  & > input {
    border: 0.5px solid transparent;
    border-radius: 4px;
    padding: 4px 8px;
    width: 100%;
    color: transparent;
    text-shadow: 0 0 0 #000000;
    font-size: 12px;
    cursor: pointer;
    transition: border 0.3s, box-shadow 0.3s;
    &:hover {
      border: 0.5px solid #9198a1;
    }
    &:focus {
      border: 0.5px solid #6F7782;
      box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
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