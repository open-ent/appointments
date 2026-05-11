import { DAY } from "~/core/enums";
import { Slot } from "~/core/types";

export interface DailySlotProps {
  day: DAY;
  slot: Slot;
  siblingsSlots: Slot[];
}

export interface StyledBoxProps {
  isSlotError?: boolean;
}
