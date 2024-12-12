import { ReactNode } from "react";

import { GRID_TYPE } from "./enum";
import { MinimalGrid } from "~/services/api/GridService/types";

export interface AvailabilityProviderContextProps {
  gridPages: GridPages;
  gridTypeLengths: GridTypeLength;
  currentGridList: GridList;
  isLoading: boolean;
  handleChangePage: (gridType: GRID_TYPE, newPage: number) => void;
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
