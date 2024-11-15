import { Dispatch, ReactNode, SetStateAction } from "react";

import { MODAL_TYPE } from "./enum";
import { Structure } from "~/hooks/types";

export interface GlobalProviderContextProps {
  isMultiStructure: boolean;
  structures: Structure[];
  getStructureNameById: (id: string) => string;
  displayModals: DisplayModalsState;
  setDisplayModals: Dispatch<SetStateAction<DisplayModalsState>>;
  handleDisplayModal: (modalType: MODAL_TYPE) => void;
}

export interface GlobalProviderProps {
  children: ReactNode;
}

export interface DisplayModalsState {
  [MODAL_TYPE.GRID]: boolean;
  [MODAL_TYPE.CONFIRMATION]: boolean;
}
