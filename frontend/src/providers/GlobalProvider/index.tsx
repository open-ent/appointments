import { createContext, FC, useContext, useMemo, useState } from "react";

import { isActionAvailable } from "@edifice-ui/react";

import { MODAL_TYPE } from "./enum";
import {
  DisplayModalsState,
  GlobalProviderContextProps,
  GlobalProviderProps,
} from "./types";
import { initialDisplayModalsState } from "./utils";
import { useStructure } from "~/hooks/useStructure";
import { useActions } from "~/services/queries";

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
  const { data: actions } = useActions();
  const hasAccessRight = isActionAvailable("access", actions) ?? false;
  const hasManageRight = isActionAvailable("manage", actions) ?? false;
  const [appointmentIdFromNotify, setAppointmentIdFromNotify] = useState<
    number | null
  >(null);

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
      hasAccessRight,
      hasManageRight,
      appointmentIdFromNotify,
      setAppointmentIdFromNotify,
      getStructureNameById,
      displayModals,
      setDisplayModals,
      handleDisplayModal,
    }),
    [
      displayModals,
      structures,
      isMultiStructure,
      hasAccessRight,
      hasManageRight,
      appointmentIdFromNotify,
    ],
  );

  return (
    <GlobalProviderContext.Provider value={value}>
      {children}
    </GlobalProviderContext.Provider>
  );
};
