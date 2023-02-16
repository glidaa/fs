import React, { useState, useRef, useMemo } from 'react';
import { useOuterClick } from 'react-outer-click';
import styles from "./ComboBox.module.scss"
import { ReactComponent as ChevronDownIcon } from "@fluentui/svg-icons/icons/chevron_down_16_regular.svg"
import { nanoid } from 'nanoid';
import ListItem from '../ListItem';

const ComboBox = (props) => {
  const {
    value,
    options = [],
    onChange,
    label,
    name,
    readOnly,
    disabled,
    inputRef
  } = props
  const selectRef = useRef(null)
  const optionsRef = useRef(null)
  const [ id ] = useState("TextField_" + nanoid(11))
  const [isComboBoxOpened, setIsComboBoxOpened] = useState(false)
  const getValueInvertedIndex = (options, value) => {
    const actualValue = value
    const optsArr = options.map(x => x[0])
    return optsArr.length - optsArr.findIndex(option => option === actualValue) - 1
  }
  const valueInvertedIndex = useMemo(() => getValueInvertedIndex(options, value), [options, value])
  const toggleComboBox = () => {
    if (!readOnly) {
      setIsComboBoxOpened(isComboBoxOpened ? false : true)
    }
  }
  useOuterClick(selectRef, () => {
    if (isComboBoxOpened) {
      setIsComboBoxOpened(false);
    }
  })
  return (
    <div
      className={[
        styles.ComboBoxShell,
        ...(disabled && [styles.disabled] || []),
      ].join(" ")}
      ref={selectRef}
      onClick={toggleComboBox}
    >
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={[
          styles.ComboBoxContainer,
          ...(disabled && [styles.disabled] || []),
        ].join(" ")}
      >
        <span className="noselect">
          {options.find(x => x[0] === value)?.[1] || ""}
        </span>
        <ChevronDownIcon fill="currentColor" />
        {(isComboBoxOpened && !disabled) && (
          <div
            ref={optionsRef}
            className={styles.Options}
            style={{
              bottom: window.innerHeight - selectRef.current.getBoundingClientRect().bottom - 5 - 35.4 * valueInvertedIndex,
              left: selectRef.current.getBoundingClientRect().left,
              width: selectRef.current.getBoundingClientRect().width - 10,
            }}
          >
            {options.map(x => (
              <ListItem
                key={x[0]}
                id={x[0]}
                primaryLabel={x[1]}
                selected={x[0] === value}
                onSelect={() => {
                  toggleComboBox()
                  onChange({ target: {
                    value: x[0],
                    name: name
                  }})
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboBox