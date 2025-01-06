import { ReactNode } from "react";

import { MY_APPOINTMENTS_LIST_STATE } from "./enum";
import {
  Appointment,
  MyAppointments,
} from "~/services/api/AppointmentService/types";

export interface MyAppointmentsProviderContextProps {
  myPendingAppointments: MyAppointments | undefined;
  myAcceptedAppointments: MyAppointments | undefined;
  myRejectedOrCanceledAppointments: MyAppointments | undefined;
  isAppointmentModalOpen: boolean;
  selectedAppointment: Appointment | undefined;
  handleChangePage: (state: MY_APPOINTMENTS_LIST_STATE, page: number) => void;
  handleChangeLimit: (state: MY_APPOINTMENTS_LIST_STATE, limit: number) => void;
  handleAcceptAppointment: (id: number) => void;
  handleRejectAppointment: (id: number) => void;
  handleCancelAppointment: (id: number) => void;
  handleClickAppointment: (id: number) => void;
  handleCloseAppointmentModal: () => void;
}

export interface MyAppointmentsProviderProps {
  children: ReactNode;
}

export interface AppointmentListInfoType {
  [MY_APPOINTMENTS_LIST_STATE.PENDING]: number;
  [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]: number;
  [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]: number;
}
