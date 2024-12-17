import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import { ALERT, DAY } from "~/core/enums";
import { Slot } from "~/core/types";
import { UserCardInfos } from "~/services/api/CommunicationService/types";
import { GridInfos } from "~/services/api/GridService/types";

export interface BookAppointmentModalProviderContextProps {
  selectedUser: UserCardInfos | null;
  isModalOpen: boolean;
  grids: GridNameWithId[] | undefined;
  gridInfos: GridInfos | undefined;
  currentSlots: DaySlots[];
  selectedGrid: GridNameWithId | null;
  selectedSlotId: number | null;
  canGoNext: boolean;
  canGoPrev: boolean;
  hasNoSlots: boolean;
  nextAvailableTimeSlot: Dayjs | null;
  isGridTimeSlotsFetching: boolean;
  isVideoCallOptionChecked: boolean;
  alert: Alert;
  handleGridChange: (gridName: string) => void;
  handleOnClickSlot: (slotId: number) => void;
  handleNextWeek: () => void;
  handlePreviousWeek: () => void;
  handleNextTimeSlot: () => void;
  handleCloseModal: () => void;
  handleOnClickCard: (user: UserCardInfos | null) => void;
  handleSubmitAppointment: () => void;
  handleVideoCallCheckboxChange: () => void;
  handleCloseAlert: () => void;
}

export interface BookAppointmentModalProviderProps {
  children: ReactNode;
}

export interface DaySlots {
  weekDay: DAY;
  day: Dayjs;
  slots: Slot[] | null;
}

export interface GridNameWithId {
  id: number;
  name: string;
}

export interface Alert {
  isOpen: boolean;
  alert: ALERT;
}
