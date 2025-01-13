import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import { MY_APPOINTMENTS_LIST_STATE } from "./enum";
import { DialogModalProps } from "~/components/DialogModal/types";
import { CONFIRM_MODAL_TYPE } from "~/core/enums";
import {
  Appointment,
  MyAppointments,
} from "~/services/api/AppointmentService/types";

export interface MyAppointmentsProviderContextProps {
  myAppointments: AppointmentsType;
  limits: AppointmentListInfoType;
  pages: AppointmentListInfoType;
  isAppointmentModalOpen: boolean;
  selectedAppointment: Appointment | undefined;
  myAppointmentsDates: Dayjs[] | undefined;
  dialogModalProps: DialogModalProps;
  handleChangePage: (state: MY_APPOINTMENTS_LIST_STATE, page: number) => void;
  handleChangeLimit: (state: MY_APPOINTMENTS_LIST_STATE, limit: number) => void;
  handleAcceptAppointment: (id: number) => void;
  handleClickAppointment: (id: number) => void;
  handleCloseAppointmentModal: () => void;
  handleOpenDialogModal: (confirmType: CONFIRM_MODAL_TYPE, id: number) => void;
  handleCloseDialogModal: () => void;
}

export interface MyAppointmentsProviderProps {
  children: ReactNode;
}

export interface AppointmentListInfoType {
  [MY_APPOINTMENTS_LIST_STATE.PENDING]: number;
  [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]: number;
  [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]: number;
}

export interface AppointmentsType {
  [MY_APPOINTMENTS_LIST_STATE.PENDING]: MyAppointments | undefined;
  [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]: MyAppointments | undefined;
  [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]: MyAppointments | undefined;
}
