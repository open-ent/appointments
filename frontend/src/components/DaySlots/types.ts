import { Slot } from "~/core/types";

export interface DaySlotsProps {
  slots: Slot[] | null;
  isMobile: boolean;
}

export interface TimeSlotProps {
  selected: boolean;
}

export interface TimeSlotWrapperProps {
  isMobile: boolean;
}
