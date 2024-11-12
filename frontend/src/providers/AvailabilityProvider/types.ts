import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import { GRID_TYPE } from "./enum";
import { HexaColor } from "~/components/ColorPicker/types";
import { GRID_STATE } from "~/core/enums";

export interface AvailabilityProviderContextProps {
  gridPages: GridPages;
  gridTypeLengths: GridTypeLength;
  currentGridList: GridList;
  handleChangePage: (gridType: GRID_TYPE, newPage: number) => void;
}

export interface AvailabilityProviderProps {
  children: ReactNode;
}

export interface MinimalGrid {
  id: string;
  name: string;
  color: HexaColor;
  beginDate: Dayjs;
  endDate: Dayjs;
  state: GRID_STATE;
  structureId: string;
}

export interface MyGridsResponse {
  grids: MinimalGrid[];
  total: number;
}

export interface GetMyGridsPayload {
  states: GRID_STATE[];
  page: number;
  limit: number;
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
