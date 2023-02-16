import React, { useState, createContext, useContext } from "react";
import * as appActions from "../actions/app";
import { useDispatch } from "react-redux";

const initalState = {
  tabs: [],
  currentTab: null,
  openTab: () => {},
  closeTab: () => {},
  clearTabs: () => {},
  setCurrentTab: () => {},
};

const TabViewContext = createContext(initalState);
export const useTabView = () => useContext(TabViewContext);
export const clearTabs = function f(...args) {
  return f.contents.call(this, ...args);
};

const TabViewManager = ({ children }) => {
  const [tabs, setTabs] = useState(initalState.tabs);
  const [currentTab, setCurrentTab] = useState(null);
  const dispatch = useDispatch();

  const openTab = (tab) => {
    if (tabs.findIndex(x => x[0] === tab[0]) === -1) {
      setTabs([...tabs, tab]);
      setCurrentTab(tab[0]);
    } else if (currentTab !== tab[0]) {
      setCurrentTab(tab[0]);
    }
    if (window.innerWidth <= 768) {
      dispatch(appActions.handleSetRightPanel(false));
      dispatch(appActions.handleSetLeftPanel(false));
    }
  };

  const closeTab = (tabId) => {
    const index = tabs.findIndex(x => x[0] === tabId);
    if (index !== -1) {
      const newTabs = [...tabs];
      newTabs.splice(index, 1);
      setTabs(newTabs);
      if (currentTab === tabId) {
        setCurrentTab(newTabs[index - 1][0]);
      }
    }
  }

  clearTabs.contents = () => {
    setTabs(tabs.slice(0, tabs.filter(x => x[3]).length));
    setCurrentTab('tasks');
  }

  return (
    <TabViewContext.Provider value={{ tabs, currentTab, openTab, closeTab, clearTabs, setCurrentTab }}>
      {children}
    </TabViewContext.Provider>
  );
};

export default TabViewManager;