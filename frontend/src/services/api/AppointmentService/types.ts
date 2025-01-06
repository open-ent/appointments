import { APPOINTMENT_STATE } from "~/core/enums";

export interface BookAppointmentPayload {
  timeSlotId: number;
  isVideoCall?: boolean;
}

export interface GetMyAppointmentsPayload {
  states: APPOINTMENT_STATE[];
  page: number;
  limit: number;
}

export interface MyMinimalAppointment {
  id: number;
  displayName: string;
  functions: string[];
  picture: string;
  beginDate: string;
  endDate: string;
  videoCallLink: string;
  state: APPOINTMENT_STATE;
  isRequester: boolean;
}

export interface MyAppointment {
  id: number;
  displayName: string;
  functions: string[];
  picture: string;
  beginDate: string;
  endDate: string;
  videoCallLink: string;
  state: APPOINTMENT_STATE;
  isVideoCall: boolean;
  place: string;
  documentId: string;
  publicComment: string;
}

export interface MyAppointmentsResponse {
  total: number;
  appointments: MyMinimalAppointment[];
}
