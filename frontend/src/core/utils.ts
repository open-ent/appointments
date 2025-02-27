import dayjs, { Dayjs } from "dayjs";
import { DAY } from "./dayjs.const";

export const isToday = (day: Dayjs): boolean => {
  return dayjs().isSame(day, DAY);
};
