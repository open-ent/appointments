import { NUMBER_MORE_USERS } from "~/providers/FindAppointmentsProvider/utils";
import { emptySplitApi } from "../EmptySplitService";
import { GetUsersPayload, Public, UserCardInfos } from "./types";
import { transformResponseToPublic } from "./utils";

export const communicationApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommunicationGroups: builder.query<Public[], string>({
      query: (structureId: string) =>
        `/structures/${structureId}/communication/from/groups`,
      transformResponse: transformResponseToPublic,
    }),
    getCommunicationUsers: builder.infiniteQuery<
      UserCardInfos[],
      GetUsersPayload,
      number
    >({
      query: ({ queryArg, pageParam }) => ({
        url: "/communication/to/users",
        params: {
          search: queryArg.search,
          limit: queryArg.limit,
          page: pageParam,
        },
      }),

      infiniteQueryOptions: {
        initialPageParam: 1,

        getNextPageParam: (lastPage, _, lastPageParam) => {
          if (lastPage.length < NUMBER_MORE_USERS) return undefined;

          return lastPageParam + 1;
        },
      },

      providesTags: ["Availability"],
    }),
  }),
});

export const {
  useGetCommunicationGroupsQuery,
  useGetCommunicationUsersInfiniteQuery,
} = communicationApi;
