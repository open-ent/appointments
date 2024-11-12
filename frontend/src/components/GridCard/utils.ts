import { GRID_STATE } from "~/core/enums";
import {
  GRID_STATE_OPEN_COLOR,
  GRID_STATE_CLOSED_COLOR,
  GRID_STATE_SUSPENDED_COLOR,
} from "~/styles/color.constants";

export const getGridStateColor = (state: GRID_STATE): string => {
  if (state === GRID_STATE.OPEN) {
    return GRID_STATE_OPEN_COLOR;
  }
  if (state === GRID_STATE.CLOSED) {
    return GRID_STATE_CLOSED_COLOR;
  }
  return GRID_STATE_SUSPENDED_COLOR;
};
