import { GridModalInputs } from "~/providers/GridModalProvider/types";
import { emptySplitApi } from "../EmptySplitService";
import {
  CreateGridPayload,
  EditGridPayload,
  GetMyGridsPayload,
  GetTimeSlotsPayload,
  GridInfos,
  MyGrids,
  NameWithId,
  TimeSlots,
  UpdateGridStatePayload,
} from "./types";
import {
  transformResponseToCompleteGridResponse,
  transformResponseToMyGridsResponse,
} from "./utils";

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
    getGridById: builder.query<GridModalInputs, number>({
      query: (gridId) => `/grids/${gridId}`,
      transformResponse: transformResponseToCompleteGridResponse,
      providesTags: ["MyGrids"],
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
      providesTags: ["MyGrids"],
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
    editGrid: builder.mutation<void, EditGridPayload>({
      query: ({ gridId, body }) => ({
        url: `/grids/${gridId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MyGrids", "Availability"],
    }),
  }),
});

export const {
  useCreateGridMutation,
  useGetGridByIdQuery,
  useGetMyGridsQuery,
  useGetMyGridsNameQuery,
  useGetAvailableUserMinimalGridsQuery,
  useGetMinimalGridInfosByIdQuery,
  useGetTimeSlotsByGridIdAndDateQuery,
  useDeleteGridMutation,
  useSuspendGridMutation,
  useRestoreGridMutation,
  useEditGridMutation,
} = gridApi;
