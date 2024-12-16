import { GetUsersPayload, Public, UserCardInfos } from "./types";
import { transformResponseToPublic } from "./utils";
import { emptySplitApi } from "../EmptySplitService";

export const communicationApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommunicationGroups: builder.query<Public[], string>({
      query: (structureId: string) =>
        `/structures/${structureId}/communication/from/groups`,
      transformResponse: transformResponseToPublic,
    }),
    getCommunicationUsers: builder.query<UserCardInfos[], GetUsersPayload>({
      query: (body) => ({
        url: "/communication/to/users",
        params: body,
      }),
      providesTags: ["Availability"],
    }),
  }),
});

export const { useGetCommunicationGroupsQuery, useGetCommunicationUsersQuery } =
  communicationApi;
