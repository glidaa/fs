import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from "react-dom"
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import styles from "./DateField.module.scss"
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/dismiss_16_regular.svg"
import formatDate from '../../../utils/formatDate';

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
      onChange({
        target: {
          value: new Date(`${month}/${day}/${year} GMT`).toISOString(),
          name: name,
        },
      });
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
    <div className={styles.DateFieldShell} style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div
        className={[
          styles.DateFieldContainer,
          ...(readOnly && [styles.readOnly] || []),
          ...(error && [styles.error] || []),
          ...(value && [styles.filled] || [])
        ].join(" ")}
      >
        <input
          name={name}
          value={value ? formatDate(value) : ""}
          placeholder={label ? null : placeholder}
          onClick={togglePicker}
          readOnly
        />  
        {clearable && value && (
          <button
            className={styles.ClearBtn}
            onClick={clearValue}
          >
            <RemoveIcon fill="currentColor" />
          </button>
        )}
        <BodyOverlay>
          {isPickerOpened && (
            <div
              className={styles.PickerContainer}
              onClick={handleOverlayClick}
            >
              <Calendar
                value={pickerValue}
                onChange={pickValue}
                shouldHighlightWeekends
              />
            </div>
          )}
        </BodyOverlay>
      </div>
      {error && <span>{error}</span>}
    </div>
  );
};

export default DateField;