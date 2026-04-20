import { Dispatch, ReactNode, SetStateAction } from "react";

import { Structure } from "~/hooks/types";
import { ModalType } from "./enum";

export interface GlobalProviderContextProps {
  isMultiStructure: boolean;
  structures: Structure[];
  hasAccessRight: boolean;
  hasManageRight: boolean;
  appointmentIdFromNotify: number | null;
  setAppointmentIdFromNotify: Dispatch<SetStateAction<number | null>>;
  gridIdFromLink: number | null;
  setGridIdFromLink: Dispatch<SetStateAction<number | null>>;
  getStructureNameById: (id: string) => string;
  displayModals: DisplayModalsState;
  setDisplayModals: Dispatch<SetStateAction<DisplayModalsState>>;
  toggleModal: (modalType: ModalType) => void;
  minHoursBeforeCancellation: number;
  isConnectedUserADML: boolean;
}

export interface GlobalProviderProps {
  children: ReactNode;
  minHoursBeforeCancellation: number;
}

export interface DisplayModalsState {
  [ModalType.GRID]: boolean;
  [ModalType.CONFIRMATION]: boolean;
  [ModalType.EXPORT]: boolean;
}
