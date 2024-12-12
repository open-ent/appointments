import { Dispatch, ReactNode, SetStateAction } from "react";

import { Dayjs } from "dayjs";

import { DAY } from "~/core/enums";
import { Slot } from "~/core/types";
import { UserCardInfos } from "~/services/api/CommunicationService/types";
import { GridInfos } from "~/services/api/GridService/types";

export interface TakeAppointmentModalProviderContextProps {
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
  handleGridChange: (gridName: string) => void;
  handleOnClickSlot: (slotId: number) => void;
  handleNextWeek: () => void;
  handlePreviousWeek: () => void;
  handleNextTimeSlot: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  handleOnClickCard: (user: UserCardInfos | null) => void;
}

export interface TakeAppointmentModalProviderProps {
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
