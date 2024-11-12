import { GRID_TYPE } from "./enum";
import { GridList, GridPages, GridTypeLength } from "./types";

export const initialGrids: GridList = {
  [GRID_TYPE.IN_PROGRESS]: [],
  [GRID_TYPE.CLOSED]: [],
};

export const initialGridsLength: GridTypeLength = {
  [GRID_TYPE.IN_PROGRESS]: 0,
  [GRID_TYPE.CLOSED]: 0,
};

export const initialPages: GridPages = {
  [GRID_TYPE.IN_PROGRESS]: 1,
  [GRID_TYPE.CLOSED]: 1,
};
