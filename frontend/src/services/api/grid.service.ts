import { emptySplitApi } from "./emptySplitApi.service";
import { GridPayload } from "~/providers/GridModalProvider/types";

export const gridApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    createGrid: builder.mutation({
      query: (body: GridPayload) => ({
        url: "/grids",
        method: "POST",
        body,
      }),
    }),
    getMyGridsName: builder.query<string[], void>({
      query: () => "/grids/names",
    }),
  }),
});

export const { useCreateGridMutation, useGetMyGridsNameQuery } = gridApi;
