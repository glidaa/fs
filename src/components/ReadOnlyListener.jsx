import React, { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { AuthState } from "../constants";

const ReadOnlyContext = createContext(false);
export const useReadOnly = () => useContext(ReadOnlyContext);

const ReadOnlyListener = ({ children }) => {

  const selectedProject = useSelector(state => state.projects[state.app.selectedProject])
  const user = useSelector(state => state.user)
  const isSynced = useSelector(state => state.app.isSynced)

  const getReadOnly = (user, selectedProject, isSynced) => {
    return (user.state === AuthState.SignedIn &&
    ((selectedProject?.owner !== user.data.username &&
    selectedProject?.permissions === "r") || !isSynced)) ||
    (user.state !== AuthState.SignedIn && selectedProject?.isTemp)
  }

  const readOnly = useMemo(() => getReadOnly(user, selectedProject, isSynced), [user, selectedProject, isSynced])

  return (
    <ReadOnlyContext.Provider value={readOnly}>
      {children}
    </ReadOnlyContext.Provider>
  );
};

export default ReadOnlyListener;
