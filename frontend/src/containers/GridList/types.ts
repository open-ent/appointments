import {
  GRID_CARD_SIZE,
  GRID_TYPE,
} from "~/providers/AvailabilityProvider/enum";

export interface GridListProps {
  gridType: GRID_TYPE;
  cardSize: GRID_CARD_SIZE;
}

export interface GridListTitleProps {
  isExpandable: boolean;
}
