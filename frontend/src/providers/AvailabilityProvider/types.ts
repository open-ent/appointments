import { ReactNode } from "react";

import { DialogModalProps } from "~/components/DialogModal/types";
import { CONFIRM_MODAL_TYPE } from "~/core/enums";
import { MinimalGrid } from "~/services/api/GridService/types";
import { GRID_MODAL_TYPE } from "../GridModalProvider/enum";
import { GRID_TYPE } from "./enum";

export interface AvailabilityProviderContextProps {
  gridPages: GridPages;
  gridTypeLengths: GridTypeLength;
  currentGridList: GridList;
  isLoading: boolean;
  dialogModalProps: DialogModalProps;
  handleOpenGridModal: (type: GRID_MODAL_TYPE, gridId?: number) => void;
  handleChangePage: (gridType: GRID_TYPE, newPage: number) => void;
  handleOpenDialogModal: (gridId: number, type: CONFIRM_MODAL_TYPE) => void;
}

export interface AvailabilityProviderProps {
  children: ReactNode;
}

export interface GridList {
  [GRID_TYPE.IN_PROGRESS]: MinimalGrid[];
  [GRID_TYPE.CLOSED]: MinimalGrid[];
}

export interface GridTypeLength {
  [GRID_TYPE.IN_PROGRESS]: number;
  [GRID_TYPE.CLOSED]: number;
}

export interface GridPages {
  [GRID_TYPE.IN_PROGRESS]: number;
  [GRID_TYPE.CLOSED]: number;
}
