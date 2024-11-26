import { Dispatch, ReactNode, SetStateAction } from "react";

import { Dayjs } from "dayjs";

import { UserCardInfos } from "../FindAppointmentsProvider/types";
import { DAY, SLOT_DURATION } from "~/core/enums";
import { Slot } from "~/core/types";

export interface TakeAppointmentModalProviderContextProps {
  selectedUser: UserCardInfos | null;
  isModalOpen: boolean;
  gridsName: string[];
  gridInfo: GridInfoType;
  gridSlots: tmpSlotsType[];
  selectedGridName: string;
  selectedSlotId: string | null;
  handleGridChange: (gridName: string) => void;
  handleOnClickSlot: (slotId: string) => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  handleOnClickCard: (user: UserCardInfos | null) => void;
}

export interface TakeAppointmentModalProviderProps {
  children: ReactNode;
}

export interface GridInfoType {
  visio: boolean;
  slotDuration: SLOT_DURATION;
  location: string;
  publicComment: string;
}

export interface tmpSlotsType {
  weekDay: DAY;
  day: Dayjs;
  slots: Slot[];
}
