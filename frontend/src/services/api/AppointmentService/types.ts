import { Dayjs } from "dayjs";

import { APPOINTMENT_STATE } from "~/core/enums";

import { Document } from "../GridService/types";

export interface BookAppointmentPayload {
  timeSlotId: number;
  isVideoCall?: boolean;
}

export interface GetMyAppointmentsPayload {
  states: APPOINTMENT_STATE[];
  page: number;
  limit: number;
}

export interface GetAppointmentsDatesPayload {
  states: APPOINTMENT_STATE[];
}

export interface AppointmentResponse extends MyMinimalAppointmentResponse {
  place: string;
  documents: Document[];
  publicComment: string;
}

export interface Appointment extends MyMinimalAppointment {
  place: string;
  documents: Document[];
  publicComment: string;
}

export interface MyMinimalAppointmentResponse {
  id: number;
  displayName: string;
  functions: string[];
  picture: string;
  beginDate: string;
  endDate: string;
  isVideoCall: boolean;
  videoCallLink: string;
  state: APPOINTMENT_STATE;
  isRequester: boolean;
}

export interface MyMinimalAppointment {
  id: number;
  displayName: string;
  functions: string[];
  picture: string;
  beginDate: Dayjs;
  endDate: Dayjs;
  isVideoCall: boolean;
  videoCallLink: string;
  state: APPOINTMENT_STATE;
  isRequester: boolean;
}

export interface MyAppointmentsResponse {
  total: number;
  appointments: MyMinimalAppointmentResponse[];
}

export interface MyAppointments {
  total: number;
  appointments: MyMinimalAppointment[];
}

export interface SpecialAppointmentInfos {
  index: number;
}
