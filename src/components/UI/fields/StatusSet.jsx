import React, { Fragment } from "react";
import generateId from "../../../utils/generateId";
import Button from "../Button";
import ComboBox from "./ComboBox";
import TextField from "./TextField";
import { ReactComponent as AddIcon } from "@fluentui/svg-icons/icons/add_16_regular.svg";
import styles from "./StatusSet.module.scss";

const StatusSet = (props) => {
  const {
    value = [],
    name,
    label,
    readOnly,
    onChange,
  } = props;
  const handleChangeTitle = (id, newTitle) => {
    if (!readOnly && onChange) {
      const newValue = JSON.parse(JSON.stringify(value));
      const statusIndex = newValue.findIndex((x) => x.id === id);
      newValue[statusIndex].title = newTitle;
      onChange({
        target: {
          name,
          value: newValue,
        },
      })
    }
  }
  const handleChangeSynonym = (id, newSynonym) => {
    if (!readOnly && onChange) {
      const newValue = JSON.parse(JSON.stringify(value));
      const statusIndex = newValue.findIndex((x) => x.id === id);
      newValue[statusIndex].synonym = newSynonym;
      onChange({
        target: {
          name,
          value: newValue,
        },
      })
    }
  }
  const handleAddStatus = () => {
    if (!readOnly && onChange) {
      const newValue = JSON.parse(JSON.stringify(value));
      const existingIds = newValue.map(x => x.id);
      newValue.push({
          id: generateId(existingIds),
          title: "Custom Status",
          synonym: "todo",
      })
      onChange({
        target: {
          name,
          value: newValue,
        },
      })
    }
  }
  return (
    <div className={styles.StatusSetShell}>
    <div className={styles.StatusSetHeader}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      {!readOnly && (
        <Button
          sm
          secondary
          icon={AddIcon}
          onClick={handleAddStatus}
        />
      )}
    </div>
      <div className={styles.StatusSetContainer}>
        {value.map(x => (
          <Fragment key={x.id}>
            <TextField
              name="status"
              value={x.title}
              placeholder="Status"
              onChange={(e) => handleChangeTitle(x.id, e.target.value)}
            />
            <ComboBox
              value={x.synonym}
              options={[
                ["todo", "Todo"],
                ["pending", "Pending"],
                ["done", "Done"],
              ]}
              onChange={(e) => handleChangeSynonym(x.id, e.target.value)}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default StatusSet