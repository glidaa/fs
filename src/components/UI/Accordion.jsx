import React, { useState } from "react";
import styles from "./Accordion.module.scss";
import { ReactComponent as ChevronUpIcon } from "@fluentui/svg-icons/icons/chevron_up_24_regular.svg"
import { ReactComponent as ChevronDownIcon } from "@fluentui/svg-icons/icons/chevron_down_24_regular.svg"

const Accordion = (props) => {
  const {
    title,
    children,
    content,
    contained
  } = props

  const [isAccordionOpened, setIsAccordionOpened] = useState(true);

  const handleClick = () => {
    setIsAccordionOpened(!isAccordionOpened);
  };

  return (
    <div
      className={[
        styles.AccordionContainer,
        ...[(contained && styles.contained) || []],
      ].join(" ")}
    >
      <div
        className={[styles.AccordionHeader, "noselect"].join(" ")}
        onClick={handleClick}
      >
        <span>{title}</span>
        {isAccordionOpened ? (
          <ChevronUpIcon fill="currentColor" />
        ) : (
          <ChevronDownIcon fill="currentColor" />
        )}
      </div>
      {isAccordionOpened && (
        <div className={styles.AccordionContent}>
          {children || content}
        </div>
      )}
    </div>
  );
};

export default Accordion;