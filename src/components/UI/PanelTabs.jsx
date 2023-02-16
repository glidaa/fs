import React, { memo } from "react";
import styles from "./PanelTabs.module.scss";

const PanelTabs = (props) => {
  const {
    tabs,
    value,
    onChange,
    disabled,
    className,
    style
  } = props;
  const handleChange = (nextVal) => {
    if (!disabled && value !== nextVal && onChange) {
      onChange(nextVal);
    }
  }
  return (
    <div
      className={[
        styles.PanelTabsShell,
        className || ""
      ].join(" ")}
      style={style}
    >
      <div
        className={[
          styles.PanelTabsContainer,
          ...((disabled && [styles.disabled]) || []),
        ].join(" ")}
      >
        {tabs.map((x) => (
          <span
            className={[
              styles.PanelTab,
              "noselect",
              ...((value === x[0] && [styles.selected]) || []),
            ].join(" ")}
            key={x[0]}
            onClick={() => handleChange(x[0])}
          >
            {x[1]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default memo(PanelTabs);
