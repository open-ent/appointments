import { emptySplitApi } from "./emptySplitApi.service";
import { Public } from "~/providers/GridModalProvider/types";

export const communicationApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommunicationGroups: builder.query<Public[], string>({
      query: (structureId: string) =>
        `/structures/${structureId}/communication/groups`,
    }),
  }),
});

export const { useGetCommunicationGroupsQuery } = communicationApi;
