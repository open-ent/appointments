import { Dayjs } from "dayjs";

export const MONDAY = 1;
export const SATURDAY = 6;

export const shouldDisableStartDate = (date: Dayjs) => {
  return date.day() !== MONDAY;
};

export const shouldDisableEndDate = (date: Dayjs) => {
  return date.day() !== SATURDAY;
};
