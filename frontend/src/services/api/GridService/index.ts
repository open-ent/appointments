import {
  CreateGridPayload,
  GetMyGridsPayload,
  GetTimeSlotsPayload,
  GridInfos,
  MyGrids,
  NameWithId,
  TimeSlots,
} from "./types";
import { transformResponseToMyGridsResponse } from "./utils";
import { emptySplitApi } from "../EmptySplitService";

export const gridApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    createGrid: builder.mutation({
      query: (body: CreateGridPayload) => ({
        url: "/grids",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyGrids"],
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
  }),
});

export const {
  useCreateGridMutation,
  useGetMyGridsQuery,
  useGetMyGridsNameQuery,
  useGetAvailableUserMinimalGridsQuery,
  useGetMinimalGridInfosByIdQuery,
  useGetTimeSlotsByGridIdAndDateQuery,
} = gridApi;
