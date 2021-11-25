import React from "react"
import styles from "./PanelTabs.module.scss"

const PanelTabs = (props) => {
  const {
      tabs,
      value,
      onChange
  } = props

  return (
    <div className={styles.PanelTabsShell}>
      <div className={styles.PanelTabsContainer}>
        {tabs.map(x => (
            <span
            className={[
              styles.PanelTab,
              "noselect",
              ...(value === x[0] && [styles.selected] || [])
            ].join(" ")}
            key={x[0]}
            onClick={() => value !== x[0] && onChange(x[0])}
          >
            {x[1]}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PanelTabs