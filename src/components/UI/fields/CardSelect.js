import React from 'react';
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
      <div className={styles.SelectContainer}>
        {values.map((x, i) => (
          <button
            className={[
              styles.Selection,
              ...(value === x && [styles.selected] || [])
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

export default CardSelect
