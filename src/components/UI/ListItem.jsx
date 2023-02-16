import React, { memo } from "react"
import styles from "./ListItem.module.scss"

const ListItem = (props) => {
  const {
    id,
    primaryLabel,
    secondaryLabel,
    prefix,
    onSelect,
    onHover,
    listeners,
    hovered,
    selected,
    disabled,
  } = props
  const handleSelect = () => {
    if (!selected && onSelect) {
      onSelect(id)
    }
  } 
  const handleHover = () => {
    if (onHover) {
      onHover(id)
    }
  }
  return (
    <div
      className="noselect"
      onClick={() => handleSelect(id)}
      onMouseEnter={handleHover}
      // {...listeners}
    >
      <div
        className={[
          styles.ListItemContainer,
          ...(hovered && [styles.hovered] || []),
          ...(selected && [styles.selected] || []),
          ...(disabled && [styles.disabled] || []),
        ].join(" ")}
      >
        {prefix}
        <div className={styles.ListItemDetails}>
          <span className={styles.ListItemPrimary}>
            {primaryLabel}
          </span>
          {secondaryLabel && (
            <span className={styles.ListItemSecondary}>
              {secondaryLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ListItem);