import {
  ShareRight,
  ShareRightAction,
  ShareRightActionDisplayName,
} from "@open-ent/client";
import { SearchState, ShareState } from "./type";

export const hasRight = (
  shareRight: ShareRight,
  shareAction: ShareRightAction,
): boolean => {
  return (
    shareRight.actions.filter(
      (a: { id: ShareRightActionDisplayName }) => shareAction.id === a.id,
    ).length > 0
  );
};

export const showShareRightLine = (
  shareRight: ShareRight,
  showBookmarkMembers: boolean,
): boolean =>
  (shareRight.isBookmarkMember && showBookmarkMembers) ||
  !shareRight.isBookmarkMember;

export const useSearchInitialState: SearchState = {
  searchInputValue: "",
  searchResults: [],
  searchAPIResults: [],
  isSearching: false,
};

export const defaultActions: ShareRightAction[] = [
  {
    id: "read",
    displayName: "read",
  },
  {
    id: "comment",
    displayName: "comment",
  },
];

export const useShareInitialState: ShareState = {
  isSharing: false,
  shareRights: {
    rights: [],
    visibleBookmarks: [],
    visibleGroups: [],
    visibleUsers: [],
  },
  shareRightActions: [],
};
