import React, { useState, useRef } from 'react';
import { useOuterClick } from 'react-outer-click';
import styles from "./Dropdown.module.scss"
import { ReactComponent as ChevronUpIcon } from "../../../assets/chevron-up-outline.svg"
import { ReactComponent as ChevronDownIcon } from "../../../assets/chevron-down-outline.svg"

const Dropdown = (props) => {
  const { readOnly } = props
  const selectRef = useRef(null)
  const [isDropdownOpened, setIsDropdownOpened] = useState(false)
  const toggleDropdown = (e) => {
    if (!readOnly) {
      setIsDropdownOpened(isDropdownOpened ? false : true)
    }
  }
  useOuterClick(selectRef, () => {
    if (isDropdownOpened) {
      setIsDropdownOpened(false);
    }
  })
  return (
    <div
      className={styles.DropdownShell}
      ref={selectRef}
      onClick={toggleDropdown}
    >
      <div
        className={[
          styles.DropdownContainer,
          ...(isDropdownOpened && [styles.opened] || [])
        ].join(" ")}
      >
        <input
          className="noselect"
          name={props.name}
          value={props.options[(props.value || props.defaultValue)]}
          contentEditable={false}
          readOnly
        />
        {isDropdownOpened ? (
          <ChevronUpIcon
            width={18}
            height={18}
            strokeWidth={48}
            color="#C0C0C0"
          />
        ) : (
          <ChevronDownIcon
            width={18}
            height={18}
            strokeWidth={48}
            color="#C0C0C0"
          />
        )}
      </div>
      {isDropdownOpened && <div className={styles.Options}>
        {Object.entries(props.options).map(x => (
          <span
            key={x[0]}
            className={[
              "noselect",
              ...(x[0] === (props.value || props.defaultValue) && [styles.selected] || [])
            ].join(" ")}
            onClick={() => {
                toggleDropdown()
                props.onChange({ target: {
                  value: x[0],
                  name: props.name
                }})
              }
            }
          >
            {x[1]}
          </span>
        ))}
      </div>}
    </div>
  );
};

export default Dropdown