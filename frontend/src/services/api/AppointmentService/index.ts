import { Dayjs } from "dayjs";

import {
  Appointment,
  BookAppointmentPayload,
  GetAppointmentsDatesPayload,
  GetMyAppointmentsPayload,
  MyAppointments,
} from "./types";
import {
  transformResponseToAppointment,
  transformResponseToDayjsArray,
  transformResponseToMyAppointments,
} from "./utils";
import { emptySplitApi } from "../EmptySplitService";

export const appointmentApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    bookAppointment: builder.mutation<void, BookAppointmentPayload>({
      query: ({ timeSlotId, isVideoCall }) => ({
        url: `/appointments/${timeSlotId}${
          isVideoCall !== undefined ? `?isVideoCall=${isVideoCall}` : ""
        }`,
        method: "POST",
      }),
      invalidatesTags: ["Availability", "MyAppointments"],
    }),
    getMyAppointments: builder.query<MyAppointments, GetMyAppointmentsPayload>({
      query: (body) => {
        const statesString = JSON.stringify(body.states);
        return {
          url: "/appointments",
          params: {
            ...body,
            states: statesString,
          },
        };
      },
      transformResponse: transformResponseToMyAppointments,
      providesTags: ["MyAppointments"],
    }),
    getAppointment: builder.query<Appointment, number>({
      query: (appointmentId) => `/appointments/${appointmentId}`,
      transformResponse: transformResponseToAppointment,
    }),
    getAppointmentsDates: builder.query<Dayjs[], GetAppointmentsDatesPayload>({
      query: (body) => {
        const statesString = JSON.stringify(body.states);
        return {
          url: "/appointments/dates",
          params: {
            ...body,
            states: statesString,
          },
        };
      },
      transformResponse: transformResponseToDayjsArray,
      providesTags: ["MyAppointments"],
    }),
    acceptAppointment: builder.mutation<void, number>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/accept`,
        method: "PUT",
      }),
      invalidatesTags: ["MyAppointments"],
    }),
    rejectAppointment: builder.mutation<void, number>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/reject`,
        method: "PUT",
      }),
      invalidatesTags: ["MyAppointments"],
    }),
    cancelAppointment: builder.mutation<void, number>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["MyAppointments"],
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useGetMyAppointmentsQuery,
  useGetAppointmentQuery,
  useGetAppointmentsDatesQuery,
  useAcceptAppointmentMutation,
  useRejectAppointmentMutation,
  useCancelAppointmentMutation,
} = appointmentApi;
