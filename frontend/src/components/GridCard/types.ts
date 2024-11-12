import { HexaColor } from "../ColorPicker/types";
import { GRID_STATE } from "~/core/enums";
import { GRID_CARD_SIZE } from "~/providers/AvailabilityProvider/enum";
import { MinimalGrid } from "~/providers/AvailabilityProvider/types";

export interface GridCardProps {
  grid: MinimalGrid;
  size: GRID_CARD_SIZE;
}

export interface ColorDotProps {
  color: HexaColor;
}

export interface StateDotProps {
  state: GRID_STATE;
}

export interface StyledSizeProps {
  size: GRID_CARD_SIZE;
}
