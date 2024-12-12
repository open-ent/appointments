import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const delayBaseQuery = async (args: any, api: any, extraOptions: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0));

  return fetchBaseQuery({ baseUrl: "/appointments/" })(args, api, extraOptions);
};

export const emptySplitApi = createApi({
  baseQuery: delayBaseQuery,
  tagTypes: ["MyGrids"],
  endpoints: () => ({}),
});
