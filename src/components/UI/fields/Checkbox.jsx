import React, { memo } from "react";
import styles from "./Checkbox.module.scss";
import { ReactComponent as CheckmarkIcon } from "@fluentui/svg-icons/icons/checkmark_12_regular.svg";

const Checkbox = (props) => {
  const {
    name,
    onChange,
    label,
    value = false,
    readOnly,
    disabled,
  } = props;

  const handleCheck = (nextVal) => {
    if (!(readOnly || disabled)) {
      onChange({
        target: {
          value: nextVal,
          name: name,
        },
      });
    }
  };

  return (
    <div
      className={[
        styles.CheckboxShell,
        ...(disabled && [styles.disabled] || []),
        ...(readOnly && [styles.readOnly] || []),
      ].join(" ")}
    >
      <button
        className={[
          styles.CheckToggle,
          ...((value && [styles.checked]) || []),
        ].join(" ")}
        onClick={() => handleCheck(!value)}
      >
        {value && <CheckmarkIcon fill="currentColor" width={14} height={14} />}
      </button>
      {label && (
        <label htmlFor={name} onClick={() => handleCheck(!value)}>
          {label}
        </label>
      )}
    </div>
  );
};

export default memo(Checkbox);
