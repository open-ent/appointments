import { Slot } from "~/core/types";

export const sortSlots = (slots: Slot[]): Slot[] => {
  return slots.sort((a, b) => {
    const timeA = a.begin.parseToDayjs();
    const timeB = b.begin.parseToDayjs();
    return timeA.isBefore(timeB) ? -1 : 1;
  });
};
