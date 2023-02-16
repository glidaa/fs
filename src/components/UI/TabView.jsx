import React, { memo } from "react";
import styles from "./TabView.module.scss";
import { ReactComponent as CloseIcon } from "@fluentui/svg-icons/icons/dismiss_16_regular.svg";
import IconButton from "./IconButton";
import ShadowScroll from "../ShadowScroll";

const TabView = (props) => {
  const {
    tabs = [],
    value,
    onChange,
    onCloseTab,
    disabled,
  } = props;
  const handleChange = (nextVal) => {
    if (!disabled && value !== nextVal && onChange) {
      onChange(nextVal);
    }
  }
  const handleCloseTab = (tab) => {
    if (!disabled && onCloseTab) {
      onCloseTab(tab);
    }
  }
  return (
    <div
      className={[
        styles.TabViewContainer,
        ...((disabled && [styles.disabled]) || []),
      ].join(" ")}
    >
      <div className={styles.TabViewTabs}>
        <ShadowScroll>
          {tabs.map(x => (
            <div
              className={[
                styles.TabViewTab,
                "noselect",
                ...((value === x[0] && [styles.selected]) || []),
              ].join(" ")}
              key={x[0]}
              onClick={() => handleChange(x[0])}
            >
              {React.createElement(x[2], { width: 16, height: 16 })}
              <span>{x[1]}</span>
              {!x[4] && (
                <IconButton
                  icon={CloseIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(x[0])
                  }}
                />
              )}
            </div>
          ))}
        </ShadowScroll>
      </div>
      <div className={styles.TabsContents}>
        {tabs.map((x) => (
          <div
            className={[
              styles.TabContents,
              ...((value === x[0] && [styles.selected]) || []),
            ].join(" ")}
            key={x[0]}
          >
            {x[3]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TabView);
