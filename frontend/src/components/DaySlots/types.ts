import { MODAL_SIZE } from "~/containers/TakeAppointmentModal/enum";
import { Slot } from "~/core/types";

export interface DaySlotsProps {
  slots: Slot[];
  modalSize: MODAL_SIZE;
}

export interface TimeSlotProps {
  selected: boolean;
}

export interface TimeSlotWrapperProps {
  modalSize: MODAL_SIZE;
}
