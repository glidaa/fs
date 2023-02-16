import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from "react-redux";
import SidPanel from "../UI/SidePanel";
import TASK_HUB from "./TaskHub";
import BATCH_HUB from "./BatchHub";
import PROJECTS from "./Projects";
import ACCOUNT_SETTINGS from "./AccountSettings";
import PROJECT_SETTINGS from "./ProjectSettings";
import APP_SETTINGS from "./AppSettings";
import NOTIFICATIONS from "./Notifications";

const sidePanelPages = {
  TASK_HUB,
  BATCH_HUB,
  PROJECTS,
  ACCOUNT_SETTINGS,
  PROJECT_SETTINGS,
  APP_SETTINGS,
  NOTIFICATIONS
}

const SidePanel = (props) => {
  const { right } = props;
  const [panelProps, setPanelProps] = useState({})
  const [shouldRender, setShouldRender] = useState(false)

  const isRightPanelOpened = useSelector(state => state.app.isRightPanelOpened)
  const isLeftPanelOpened = useSelector(state => state.app.isLeftPanelOpened)
  const rightPanelPage = useSelector(state => state.app.rightPanelPage)
  const leftPanelPage = useSelector(state => state.app.leftPanelPage)

  const pageRef = useCallback(node => {
    if (node !== null) {
      setPanelProps(node.panelProps);
    }
  }, []);
  const getPanelPageInstance = (panelPage) => {
    if (sidePanelPages[panelPage]) {
      const Page = sidePanelPages[panelPage];
      return <Page ref={pageRef} />;
    } else {
      pageRef.current = null;
      return null;
    }
  }
  const handleAnimationEnd = () => {
    if ((right && !isRightPanelOpened) || (!right && !isLeftPanelOpened)) {
      setShouldRender(false);
    }
  }
  useEffect(() => {
    if ((right && isRightPanelOpened) || (!right && isLeftPanelOpened)) {
      setShouldRender(true);
    }
  }, [isRightPanelOpened, isLeftPanelOpened]);
  const pageInstance = right
    ? useMemo(() => getPanelPageInstance(rightPanelPage), [rightPanelPage])
    : useMemo(() => getPanelPageInstance(leftPanelPage), [leftPanelPage]);
  return pageInstance && shouldRender ? (
    <SidPanel
      right={right}
      open={right ? isRightPanelOpened : isLeftPanelOpened}
      onAnimationEnd={handleAnimationEnd}
      {...panelProps}
    >
      {pageInstance}
    </SidPanel>
  ) : null;
};

export default SidePanel;