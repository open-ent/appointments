import {
  BookAppointmentPayload,
  GetMyAppointmentsPayload,
  MyAppointment,
  MyAppointmentsResponse,
} from "./types";
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
      invalidatesTags: ["Availability"],
    }),
    getMyAppointments: builder.query<
      MyAppointmentsResponse,
      GetMyAppointmentsPayload
    >({
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
    }),
    getAppointment: builder.query<MyAppointment, number>({
      query: (appointmentId) => `/appointments/${appointmentId}`,
    }),
    acceptAppointment: builder.mutation<void, number>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/accept`,
        method: "PUT",
      }),
    }),
    rejectAppointment: builder.mutation<void, number>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/reject`,
        method: "PUT",
      }),
    }),
    cancelAppointment: builder.mutation<void, number>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/cancel`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useGetMyAppointmentsQuery,
  useGetAppointmentQuery,
  useAcceptAppointmentMutation,
  useRejectAppointmentMutation,
  useCancelAppointmentMutation,
} = appointmentApi;
