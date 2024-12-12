import { Group, Public } from "./types";

export const transformResponseToPublic = (response: Group[]): Public[] => {
  return response.map((group) => ({
    groupId: group.id,
    groupName: group.name,
  }));
};
