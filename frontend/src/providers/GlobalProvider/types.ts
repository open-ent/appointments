import { Dispatch, ReactNode, SetStateAction } from "react";

import { MODAL_TYPE } from "./enum";

export interface GlobalProviderContextProps {
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
