import React, { useState, useRef } from "react";
import { useOuterClick } from "react-outer-click";
import styledComponents from "styled-components";

export const Select = (props) => {
  const selectRef = useRef(null);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const toggleDropdown = (e) => {
    setIsDropdownOpened(isDropdownOpened ? false : true);
  };
  useOuterClick(selectRef, () => {
    if (isDropdownOpened) {
      setIsDropdownOpened(false);
    }
  });
  return (
    <SelectContainer ref={selectRef}>
      <input
        name={props.name}
        value={props.options[props.value || props.defaultValue]}
        contentEditable={false}
        onClick={toggleDropdown}
        readOnly
      />
      {isDropdownOpened && (
        <Options>
          {Object.entries(props.options).map((x) => (
            <span
              key={x[0]}
              className={
                x[0] === (props.value || props.defaultValue) ? "selected" : null
              }
              onClick={() => {
                toggleDropdown();
                props.onChange({
                  target: {
                    value: x[0],
                    name: props.name,
                  },
                });
              }}
            >
              {x[1]}
            </span>
          ))}
        </Options>
      )}
    </SelectContainer>
  );
};

const SelectContainer = styledComponents.div`
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

  @media only screen and (max-width: 768px) {
    width: auto;
    height: auto;
    & > input {
      border: 0.5px solid transparent;
      border-radius: 4px;
      padding: 9px 10px;
      font-size: 12px;
      transition: border 0.3s, box-shadow 0.3s;
      border: 0.5px solid #6F7782;
      margin-top: 5px;
      width: auto;
      &:hover {
        border: 0.5px solid #9198a1;
      }
      &:focus {
        border: 0.5px solid #6F7782;
        box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
      }
    }
  }

`;
const Options = styledComponents.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  width: 100%;
  font-size: 12px;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
  & > span {
    padding: 8px;
    cursor: pointer;
  }
  & > span:hover {
    background-color: #F5F5F5;
  }
  & > span.selected {
    background-color: #E6F7FF;
  }
`;
