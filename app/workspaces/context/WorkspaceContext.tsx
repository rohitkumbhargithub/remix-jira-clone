import { createContext, useContext } from "react";

export const WorkspaceContext = createContext();

export const useWorkspace = () => {
  return useContext(WorkspaceContext);
};
