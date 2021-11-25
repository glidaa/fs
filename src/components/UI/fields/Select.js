import React from 'react';
import styles from "./Select.module.scss";

const Select = (props) => {

	const {
    name,
		value,
    values,
    options,
		onChange,
    label,
    readOnly,
    style
	} = props;

	const onSelect = (nextVal) => {
    if (!readOnly) {
      onChange({ target: {
        value: nextVal,
        name: name
      }})
    }
	};

	return (
    <div className={styles.SelectShell} style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div
        className={[
          styles.SelectContainer,
          ...(readOnly && [styles.readOnly] || [])
        ].join(" ")}
      >
        {values.map((x, i) => (
          <button
            className={[
              styles.Selection,
              ...(value === x && [styles.selected] || [])
            ].join(" ")}
            key={x}
            onClick={() => onSelect(x)}
          >
            {options[i]}
          </button>
        ))}
      </div>
    </div>
	)
}

export default Select
