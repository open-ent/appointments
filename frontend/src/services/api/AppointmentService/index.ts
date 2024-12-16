import { BookAppointmentPayload } from "./types";
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
  }),
});

export const { useBookAppointmentMutation } = appointmentApi;
