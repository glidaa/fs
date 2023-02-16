import React, { memo } from 'react';
import styles from "./CardSelect.module.scss";

const CardSelect = (props) => {

  const {
    name,
    value,
    values,
    options,
    descriptions,
    onChange,
    label,
    readOnly,
    disabled,
    row,
    centeredText,
  } = props;

  const onSelect = (nextVal) => {
    if (!(readOnly || disabled)) {
      onChange({ target: {
        value: nextVal,
        name: name
      }})
    }
  };

  return (
    <div className={styles.SelectShell}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div
        className={[
          styles.SelectContainer,
          ...(row && [styles.row] || []),
          ...(centeredText && [styles.centeredText] || [])
        ].join(" ")}
      >
        {values.map((x, i) => (
          <button
            className={[
              styles.Selection,
              ...(value === x && [styles.selected] || []),
              ...(readOnly && [styles.readOnly] || []),
              ...(disabled && [styles.disabled] || [])
            ].join(" ")}
            key={x}
            onClick={() => onSelect(x)}
          >
            <span>{options[i]}</span>
            <span>{descriptions[i]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default memo(CardSelect)
