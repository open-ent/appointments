import { DAY, DURATION, PERIODICITY } from "./enums";

export const GRID_PER_PAGE = 5;

export const MAX_STRING_LENGTH = 250;

export const DURATION_VALUES = {
  [DURATION.FIFTEEN_MINUTES]: {
    displayValue: "15 min",
    numberOfMinutes: 15,
  },
  [DURATION.THIRTY_MINUTES]: {
    displayValue: "30 min",
    numberOfMinutes: 30,
  },
  [DURATION.FOURTYFIVE_MINUTES]: {
    displayValue: "45 min",
    numberOfMinutes: 45,
  },
  [DURATION.ONE_HOUR]: {
    displayValue: "1 h",
    numberOfMinutes: 60,
  },
};

export const DAY_VALUES = {
  [DAY.MONDAY]: {
    i18nKey: "appointments.monday",
    numberOfWeekDay: 0,
  },
  [DAY.TUESDAY]: {
    i18nKey: "appointments.tuesday",
    numberOfWeekDay: 1,
  },
  [DAY.WEDNESDAY]: {
    i18nKey: "appointments.wednesday",
    numberOfWeekDay: 2,
  },
  [DAY.THURSDAY]: {
    i18nKey: "appointments.thursday",
    numberOfWeekDay: 3,
  },
  [DAY.FRIDAY]: {
    i18nKey: "appointments.friday",
    numberOfWeekDay: 4,
  },
  [DAY.SATURDAY]: {
    i18nKey: "appointments.saturday",
    numberOfWeekDay: 5,
  },
};

export const PERIODICITY_VALUES = {
  [PERIODICITY.WEEKLY]: {
    numberOfWeeks: 1,
    i18nKey: "appointments.grid.periodicity.weekly",
  },
  [PERIODICITY.BIWEEKLY]: {
    numberOfWeeks: 2,
    i18nKey: "appointments.grid.periodicity.biweekly",
  },
};

export const DISPLAY_DATE_FORMAT = "DD/MM/YYYY";
