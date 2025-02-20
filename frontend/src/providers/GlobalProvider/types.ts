import { Dispatch, ReactNode, SetStateAction } from "react";

import { Structure } from "~/hooks/types";
import { MODAL_TYPE } from "./enum";

export interface GlobalProviderContextProps {
  isMultiStructure: boolean;
  structures: Structure[];
  hasAccessRight: boolean;
  hasManageRight: boolean;
  appointmentIdFromNotify: number | null;
  setAppointmentIdFromNotify: Dispatch<SetStateAction<number | null>>;
  getStructureNameById: (id: string) => string;
  displayModals: DisplayModalsState;
  setDisplayModals: Dispatch<SetStateAction<DisplayModalsState>>;
  handleDisplayModal: (modalType: MODAL_TYPE) => void;
  minHoursBeforeCancellation: number;
}

export interface GlobalProviderProps {
  children: ReactNode;
  minHoursBeforeCancellation: number;
}

export interface DisplayModalsState {
  [MODAL_TYPE.GRID]: boolean;
  [MODAL_TYPE.CONFIRMATION]: boolean;
}
