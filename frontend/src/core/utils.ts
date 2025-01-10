import dayjs, { Dayjs } from "dayjs";

export const isToday = (day: Dayjs): boolean => {
  return dayjs().locale("fr").isSame(day, "day");
};
