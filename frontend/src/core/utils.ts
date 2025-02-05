import dayjs, { Dayjs } from "dayjs";

export const isToday = (day: Dayjs): boolean => {
  return dayjs().isSame(day, "day");
};
