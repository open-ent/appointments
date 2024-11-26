import { createContext, FC, useContext, useMemo, useState } from "react";

import { MODAL_TYPE } from "./enum";
import {
  DisplayModalsState,
  GlobalProviderContextProps,
  GlobalProviderProps,
} from "./types";
import { initialDisplayModalsState } from "./utils";
import { useStructure } from "~/hooks/useStructure";

const GlobalProviderContext = createContext<GlobalProviderContextProps | null>(
  null,
);

export const useGlobal = () => {
  const context = useContext(GlobalProviderContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};

export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
  const { isMultiStructure, structures, getStructureNameById } = useStructure();

  const [displayModals, setDisplayModals] = useState<DisplayModalsState>(
    initialDisplayModalsState,
  );

  const handleDisplayModal = (modalType: MODAL_TYPE) => {
    setDisplayModals((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };

  const value = useMemo<GlobalProviderContextProps>(
    () => ({
      isMultiStructure,
      structures,
      getStructureNameById,
      displayModals,
      setDisplayModals,
      handleDisplayModal,
    }),
    [displayModals, structures, isMultiStructure],
  );

  return (
    <GlobalProviderContext.Provider value={value}>
      {children}
    </GlobalProviderContext.Provider>
  );
};
