import { SvgIconProps } from "@mui/material";
import { Theme, ToastPosition } from "react-toastify";

import { APPOINTMENT_STATE, DAY, DURATION, PERIODICITY } from "./enums";
import { MY_APPOINTMENTS_LIST_STATE } from "~/providers/MyAppointmentsProvider/enum";

export const GRID_PER_PAGE = 5;

export const MAX_STRING_LENGTH = 250;

export const APPOINTMENT_CARDS_GAP = 40;

export const APPOINTMENT_CARD_WIDTH = 270; // 230 width + 40 gap

export const DURATION_VALUES = {
  [DURATION.FIFTEEN_MINUTES]: {
    displayValue: "15min",
    numberOfMinutes: 15,
  },
  [DURATION.THIRTY_MINUTES]: {
    displayValue: "30min",
    numberOfMinutes: 30,
  },
  [DURATION.FOURTYFIVE_MINUTES]: {
    displayValue: "45min",
    numberOfMinutes: 45,
  },
  [DURATION.ONE_HOUR]: {
    displayValue: "1h",
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

export const TOAST_CONFIG = {
  position: "top-center" as ToastPosition,
  autoClose: 5000,
  theme: "light" as Theme,
};

export const APPOINTMENT_STATE_VALUES = {
  [APPOINTMENT_STATE.CREATED]: {
    i18nKey: "appointments.pending",
    color: "warning" as SvgIconProps["color"],
  },
  [APPOINTMENT_STATE.ACCEPTED]: {
    i18nKey: "appointments.accepted",
    color: "success" as SvgIconProps["color"],
  },
  [APPOINTMENT_STATE.REFUSED]: {
    i18nKey: "appointments.refused",
    color: "error" as SvgIconProps["color"],
  },
  [APPOINTMENT_STATE.CANCELED]: {
    i18nKey: "appointments.canceled",
    color: "error" as SvgIconProps["color"],
  },
};

export const MY_APPOINTMENTS_LIST_STATE_VALUES = {
  [MY_APPOINTMENTS_LIST_STATE.PENDING]: {
    i18nTitleKey: "appointments.my.appointments.pending",
    i18nEmptyStateKey: "appointments.my.appointments.pending.empty.state",
  },
  [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]: {
    i18nTitleKey: "appointments.my.appointments.accepted",
    i18nEmptyStateKey: "appointments.my.appointments.accepted.empty.state",
  },
  [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]: {
    i18nTitleKey: "appointments.my.appointments.rejected.or.canceled",
    i18nEmptyStateKey: "",
  },
};
