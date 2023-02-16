import React, { memo, useState } from 'react';
import styles from "./SidePanel.module.scss";
import { ReactComponent as BackRightArrowIcon } from "@fluentui/svg-icons/icons/chevron_right_24_regular.svg";
import { ReactComponent as BackLeftArrowIcon } from "@fluentui/svg-icons/icons/chevron_left_24_regular.svg";
import Button from './Button';

const SidePanel = (props) => {
  const {
    title,
    right,
    open,
    unclosable,
    actionIcon,
    onClose,
    onAction,
    header,
    footer,
    submitLabel,
    submitDisabled,
    onSubmit,
    onFilesDrop,
    onAnimationEnd,
    disabled,
    className,
    style
  } = props;
  const [inDropZone, setInDropZone] = useState(false);
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  }
  const handleAction = () => {
    if (actionIcon && onAction) {
      onAction();
    }
  }
  const handleAnimationEnd = (e) => {
    if (onAnimationEnd) {
      onAnimationEnd(e);
    }
  }
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  }
  const handleDragEnter = (e) => {
    if (onFilesDrop) {
      e.preventDefault();
      e.stopPropagation();
      setInDropZone(true);
    }
  };
  const handleDragLeave = (e) => {
    if (onFilesDrop) {
      if (e.target.getAttribute("name") === "sidePanelShell") {
        e.preventDefault();
        e.stopPropagation();
        setInDropZone(false);
      }
    }
  };
  const handleDragOver = (e) => {
    if (onFilesDrop) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      setInDropZone(true);
    }
  };
  const handleDrop = (e) => {
    if (onFilesDrop) {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer ?
        [...e.dataTransfer.files] :
        [...e.target.files];
      if (files) {
        const blobs = [];
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onloadend = function () {
            const blob = new Blob([reader.result], { type: file.type });
            blob["name"] = file.name;
            blobs.push(blob);
            if (onFilesDrop && blobs.length === files.length) {
              onFilesDrop(blobs);
            }
          };
        }
      }
      setInDropZone(false);
    }
  };
  return (
    <div
      name="sidePanelShell"
      className={[
        styles.SidePanelShell,
        ...(right && [styles.right] || []),
        ...(open && [styles.opened] || []),
        ...((footer || submitLabel) && [styles.hasFooter] || []),
        ...(disabled && [styles.disabled] || []),
        ...(inDropZone && [styles.inDropZone] || []),
        "no-keyboard-portrait-padding-bottom-83",
        className || ""
      ].join(" ")}
      style={style}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.SidePanelToolbar}>
        {!unclosable ? (
          <button
            className={styles.SidePanelToolbarAction}
            onClick={handleClose}
          >
            {right ? (
              <BackRightArrowIcon fill="currentColor" />
            ) : (
              <BackLeftArrowIcon fill="currentColor" />
            )}
          </button>
        ) : (
          <div className={styles.SidePanelToolbarDumpAction} />
        )}
        <span className={styles.SidePanelTitle}>
          {title || ""}
        </span>
        {actionIcon ? (
          <button
            className={styles.SidePanelToolbarAction}
            onClick={handleAction}
          >
            {React.createElement(actionIcon, { fill: "currentColor" })}
          </button>
        ) : (
          <div className={styles.SidePanelToolbarDumpAction} />
        )}
      </div>
      {header}
      <div className={`${styles.SidePanelContent} sleek-scrollbar`}>
        {props.children}
      </div>
      {footer}
      {submitLabel && (
        <Button
          className={styles.SidePanelSubmit}
          label={submitLabel}
          onClick={handleSubmit}
          disabled={submitDisabled}
        >
          {submitLabel}
        </Button>
      )}
    </div>
  );
};

export default memo(SidePanel);