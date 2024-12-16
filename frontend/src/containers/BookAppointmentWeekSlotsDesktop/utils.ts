import dayjs from "dayjs";

import { DaySlots } from "~/providers/BookAppointmentModalProvider/types";

export const isToday = (daySlot: DaySlots): boolean => {
  return dayjs().locale("fr").isSame(daySlot.day, "day");
};
