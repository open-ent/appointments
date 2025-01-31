import { emptySplitApi } from "../EmptySplitService";
import {
  CreateGridPayload,
  GetMyGridsPayload,
  GetTimeSlotsPayload,
  GridInfos,
  MyGrids,
  NameWithId,
  TimeSlots,
  UpdateGridStatePayload,
} from "./types";
import { transformResponseToMyGridsResponse } from "./utils";

export const gridApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    createGrid: builder.mutation({
      query: (body: CreateGridPayload) => ({
        url: "/grids",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyGrids", "Availability"],
    }),
    getMyGrids: builder.query<MyGrids, GetMyGridsPayload>({
      query: (body) => {
        const statesString = JSON.stringify(body.states);
        return {
          url: "/grids",
          params: {
            ...body,
            states: statesString,
          },
        };
      },
      transformResponse: transformResponseToMyGridsResponse,
      providesTags: ["MyGrids"],
    }),
    getMyGridsName: builder.query<string[], void>({
      query: () => "/grids/names",
    }),
    getAvailableUserMinimalGrids: builder.query<NameWithId[], string>({
      query: (userId) => `/users/${userId}/grids/minimal`,
      providesTags: ["Availability"],
    }),
    getMinimalGridInfosById: builder.query<GridInfos, number>({
      query: (gridId) => `/grids/${gridId}/minimal/infos`,
      providesTags: ["Availability"],
    }),
    getTimeSlotsByGridIdAndDate: builder.query<TimeSlots, GetTimeSlotsPayload>({
      query: ({ gridId, beginDate, endDate }) => ({
        url: `/grids/${gridId}/timeslots`,
        params: {
          beginDate: beginDate,
          endDate: endDate,
        },
      }),
      providesTags: ["Availability"],
    }),
    deleteGrid: builder.mutation<void, UpdateGridStatePayload>({
      query: ({ gridId, deleteAppointments }) => ({
        url: `/grids/${gridId}/delete`,
        method: "PUT",
        params: { deleteAppointments },
      }),
      invalidatesTags: ["MyGrids", "Availability", "MyAppointments"],
    }),
    suspendGrid: builder.mutation<void, UpdateGridStatePayload>({
      query: ({ gridId, deleteAppointments }) => ({
        url: `/grids/${gridId}/suspend`,
        method: "PUT",
        params: { deleteAppointments },
      }),
      invalidatesTags: ["MyGrids", "Availability", "MyAppointments"],
    }),
    restoreGrid: builder.mutation({
      query: ({ gridId }) => ({
        url: `/grids/${gridId}/restore`,
        method: "PUT",
      }),
      invalidatesTags: ["MyGrids", "Availability"],
    }),
  }),
});

export const {
  useCreateGridMutation,
  useGetMyGridsQuery,
  useGetMyGridsNameQuery,
  useGetAvailableUserMinimalGridsQuery,
  useGetMinimalGridInfosByIdQuery,
  useGetTimeSlotsByGridIdAndDateQuery,
  useDeleteGridMutation,
  useSuspendGridMutation,
  useRestoreGridMutation,
} = gridApi;
