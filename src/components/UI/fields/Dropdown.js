import React, { useState, useRef } from 'react';
import { useOuterClick } from 'react-outer-click';
import styled from "styled-components"
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
    <DropdownShell ref={selectRef} onClick={toggleDropdown}>
      <DropdownContainer isDropdownOpened={isDropdownOpened}>
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
      </DropdownContainer>
      {isDropdownOpened && <Options>
        {Object.entries(props.options).map(x => (
          <span
            key={x[0]}
            className={x[0] === (props.value || props.defaultValue) ? "selected noselect" : "noselect"}
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
      </Options>}
    </DropdownShell>
  );
};

const DropdownShell = styled.div`
  width: 100%;
  height: 32.4px;
`

const DropdownContainer = styled.div`
  width: calc(100% - 20px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border: 1px solid #C0C0C0;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: border 0.3s, box-shadow 0.3s;
  ${({isDropdownOpened, theme}) => isDropdownOpened ? `
    border: 1px solid ${theme.primary};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  ` : ``}
  & > input {
    pointer-events: none;
    width: 100%;
    color: transparent;
    border: none;
    background-color: transparent;
    text-shadow: 0 0 0 ${({theme})=> theme.txtColor};
    font-size: 12px;
    cursor: pointer;
  }
`

const Options = styled.div`
  position: relative;
  display: flex;
  top: 5px;
  flex-direction: column;
  border: 1px solid #C0C0C0;
  background-color: #FFFFFF;
  width: 100%;
  font-size: 12px;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  & > span {
    padding: 8px;
    cursor: pointer;
  }
  & > span:first-child {
    border-radius: 8px 8px 0 0;
  }
  & > span:last-child {
    border-radius: 0 0 8px 8px;
  }
  & > span:hover {
    background-color: #F5F5F5;
  }
  & > span.selected {
    color: ${({theme})=> theme.primary};
    background-color: ${({theme})=> theme.primaryLight};
  }
`

export default Dropdown