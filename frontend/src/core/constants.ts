import { SvgIconProps } from "@mui/material";
import { Theme, ToastPosition } from "react-toastify";

import {
  APPOINTMENT_STATE,
  CONFIRM_MODAL_TYPE,
  DAY,
  DURATION,
  PERIODICITY,
  TOAST_TYPE,
} from "./enums";
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
export const TEXT_DATE_FORMAT = "DD MMMM YYYY";
export const TIME_FORMAT = "HH:mm";

export const TOAST_CONFIG = {
  position: "top-right" as ToastPosition,
  autoClose: 5000,
  theme: "light" as Theme,
};

export const APPOINTMENT_STATE_VALUES = {
  [APPOINTMENT_STATE.CREATED]: {
    i18nKey: "appointments.pending",
    color: "warning" as SvgIconProps["color"],
    listState: MY_APPOINTMENTS_LIST_STATE.PENDING,
  },
  [APPOINTMENT_STATE.ACCEPTED]: {
    i18nKey: "appointments.accepted",
    color: "success" as SvgIconProps["color"],
    listState: MY_APPOINTMENTS_LIST_STATE.ACCEPTED,
  },
  [APPOINTMENT_STATE.REFUSED]: {
    i18nKey: "appointments.refused",
    color: "error" as SvgIconProps["color"],
    listState: MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED,
  },
  [APPOINTMENT_STATE.CANCELED]: {
    i18nKey: "appointments.canceled",
    color: "error" as SvgIconProps["color"],
    listState: MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED,
  },
};

export const MY_APPOINTMENTS_LIST_STATE_VALUES = {
  [MY_APPOINTMENTS_LIST_STATE.PENDING]: {
    i18nTitleKey: "appointments.my.appointments.pending",
    i18nEmptyStateKey: "appointments.my.appointments.pending.empty.state",
    scrollTo: 100,
  },
  [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]: {
    i18nTitleKey: "appointments.my.appointments.accepted",
    i18nEmptyStateKey: "appointments.my.appointments.accepted.empty.state",
    scrollTo: 250,
  },
  [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]: {
    i18nTitleKey: "appointments.my.appointments.rejected.or.canceled",
    i18nEmptyStateKey: "",
    scrollTo: 500,
  },
};

export const CONFIRM_MODAL_VALUES = {
  [CONFIRM_MODAL_TYPE.REJECT_REQUEST]: {
    titleKey: "appointments.confirm.modal.reject.request.title",
    descriptionKey: "appointments.confirm.modal.reject.request.description",
  },
  [CONFIRM_MODAL_TYPE.CANCEL_REQUEST]: {
    titleKey: "appointments.confirm.modal.cancel.request.title",
    descriptionKey: "appointments.confirm.modal.cancel.request.description",
  },
  [CONFIRM_MODAL_TYPE.CANCEL_APPOINTMENT]: {
    titleKey: "appointments.confirm.modal.cancel.appointment.title",
    descriptionKey: "appointments.confirm.modal.cancel.appointment.description",
  },
};

export const TOAST_VALUES = {
  [TOAST_TYPE.CREATE_GRID]: {
    i18nKeySuccess: "appointments.toast.create.grid.success",
    i18nKeyError: "appointments.toast.create.grid.error",
  },
  [TOAST_TYPE.ACCEPT_APPOINTMENT]: {
    i18nKeySuccess: "appointments.toast.accept.appointment.success",
    i18nKeyError: "appointments.toast.accept.appointment.error",
  },
  [TOAST_TYPE.REJECT_APPOINTMENT]: {
    i18nKeySuccess: "appointments.toast.reject.appointment.success",
    i18nKeyError: "appointments.toast.reject.appointment.error",
  },
  [TOAST_TYPE.CANCEL_APPOINTMENT]: {
    i18nKeySuccess: "appointments.toast.cancel.appointment.success",
    i18nKeyError: "appointments.toast.cancel.appointment.error",
  },
  [TOAST_TYPE.CANCEL_REQUEST]: {
    i18nKeySuccess: "appointments.toast.cancel.appointment.request.success",
    i18nKeyError: "appointments.toast.cancel.appointment.request.error",
  },
};
