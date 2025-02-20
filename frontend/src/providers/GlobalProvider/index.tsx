import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { isActionAvailable } from "@edifice.io/client";

import { useTranslation } from "react-i18next";
import {
  APPOINTMENTS,
  DEFAULT_MIN_HOURS_BEFORE_MODIFICATION,
} from "~/core/constants";
import { useStructure } from "~/hooks/useStructure";
import { useActions } from "~/services/queries";
import { MODAL_TYPE } from "./enum";
import {
  CustomWindow,
  DisplayModalsState,
  GlobalProviderContextProps,
  GlobalProviderProps,
} from "./types";
import { initialDisplayModalsState } from "./utils";

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
  const { t } = useTranslation(APPOINTMENTS);
  const hasAccessRight = isActionAvailable("access", actions) ?? false;
  const hasManageRight = isActionAvailable("manage", actions) ?? false;
  const [appointmentIdFromNotify, setAppointmentIdFromNotify] = useState<
    number | null
  >(null);
  const [minHoursBeforeCancellation, setMinHoursBeforeCancellation] =
    useState<number>(DEFAULT_MIN_HOURS_BEFORE_MODIFICATION);

  const [displayModals, setDisplayModals] = useState<DisplayModalsState>(
    initialDisplayModalsState,
  );

  const handleDisplayModal = (modalType: MODAL_TYPE) => {
    setDisplayModals((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };

  useEffect(() => {
    const checkTitle = () => {
      if (document.title !== t("appointments.title")) {
        document.title = t("appointments.title");
      }
    };
    const intervalId = setInterval(checkTitle, 250);
    return () => clearInterval(intervalId);
  }, [t]);

  useEffect(() => {
    const customWindow = window as CustomWindow;
    if (customWindow?.config?.minHoursBeforeCancellation)
      setMinHoursBeforeCancellation(
        customWindow?.config?.minHoursBeforeCancellation,
      );
  }, []);

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
      minHoursBeforeCancellation,
    }),
    [
      isMultiStructure,
      structures,
      hasAccessRight,
      hasManageRight,
      appointmentIdFromNotify,
      getStructureNameById,
      displayModals,
      minHoursBeforeCancellation,
    ],
  );

  return (
    <GlobalProviderContext.Provider value={value}>
      {children}
    </GlobalProviderContext.Provider>
  );
};
