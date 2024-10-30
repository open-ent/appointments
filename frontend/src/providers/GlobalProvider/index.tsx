import { createContext, FC, useContext, useMemo, useState } from "react";

import { MODAL_TYPE } from "./enum";
import {
  DisplayModalsState,
  GlobalProviderContextProps,
  GlobalProviderProps,
} from "./types";
import { initialDisplayModalsState } from "./utils";

const GlobalProviderContext = createContext<GlobalProviderContextProps | null>(
  null,
);

export const useGlobalProvider = () => {
  const context = useContext(GlobalProviderContext);
  if (!context) {
    throw new Error("useGlobalProvider must be used within a GlobalProvider");
  }
  return context;
};

export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
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
      displayModals,
      setDisplayModals,
      handleDisplayModal,
    }),
    [displayModals],
  );

  return (
    <GlobalProviderContext.Provider value={value}>
      {children}
    </GlobalProviderContext.Provider>
  );
};
