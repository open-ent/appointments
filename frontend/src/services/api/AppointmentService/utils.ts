import dayjs from "dayjs";

import {
  Appointment,
  AppointmentResponse,
  MyAppointments,
  MyAppointmentsResponse,
} from "./types";

export const transformResponseToAppointment = (
  response: AppointmentResponse,
) => {
  const appointment: Appointment = {
    ...response,
    beginDate: dayjs(response.beginDate),
    endDate: dayjs(response.endDate),
  };
  return appointment;
};

export const transformResponseToMyAppointments = (
  response: MyAppointmentsResponse,
) => {
  const myAppointments: MyAppointments = {
    total: response.total,
    appointments: response.appointments.map((appointment) => ({
      ...appointment,
      beginDate: dayjs(appointment.beginDate),
      endDate: dayjs(appointment.endDate),
    })),
  };
  return myAppointments;
};
