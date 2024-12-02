import { emptySplitApi } from "./emptySplitApi.service";
import { USER_STATUS } from "~/providers/FindAppointmentsProvider/enums";
import {
  GetUsersPayload,
  UserCardInfos,
} from "~/providers/FindAppointmentsProvider/types";
import { Public } from "~/providers/GridModalProvider/types";

export const communicationApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommunicationGroups: builder.query<Public[], string>({
      query: (structureId: string) =>
        `/structures/${structureId}/communication/from/groups`,
    }),
    getCommunicationUsers: builder.query<UserCardInfos[], GetUsersPayload>({
      query: (body) => ({
        url: "/communication/to/users",
        params: body,
      }),
      transformResponse: (response: any) =>
        response.map((userInfo: any) => ({
          userId: userInfo.userId,
          picture: userInfo.picture,
          displayName: userInfo.displayName,
          functions: userInfo.functions,
          lastAppointmentDate: userInfo.lastAppointmentDate,
          status: userInfo.isAvailable
            ? USER_STATUS.AVAILABLE
            : USER_STATUS.UNAVAILABLE,
        })),
    }),
  }),
});

export const { useGetCommunicationGroupsQuery, useGetCommunicationUsersQuery } =
  communicationApi;
