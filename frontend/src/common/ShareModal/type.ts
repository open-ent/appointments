import {
  ID,
  PutShareResponse,
  type RightStringified,
  type ShareRight,
  type ShareRightAction,
  type ShareRightWithVisibles,
  ShareSubject,
} from "@open-ent/client";
import { OptionListItemType } from "@open-ent/react";
import { UseMutationResult } from "@tanstack/react-query";
import { Dispatch, HTMLAttributes, Key, SetStateAction } from "react";

export interface RotativeExpandMoreRoundedIconProps {
  showBookmark: boolean;
}

// ShareResourceModal

export type ShareOptions = {
  resourceId: ID;
  resourceRights: RightStringified[];
  resourceCreatorId: string;
};

export type ShareResourceMutation = UseMutationResult<
  PutShareResponse,
  unknown,
  {
    resourceId: string;
    rights: ShareRight[];
  }
>;

export interface IShareResourceModalProps {
  appCode: string;
  /** Handle open/close state */
  isOpen: boolean;
  /**
   * Expect resourceId,
   * new rights array (replace shared array),
   * creatorId
   * of a resource */
  shareOptions: ShareOptions;
  /**
   * onCancel handler to close ShareModal
   */
  onCancel: () => void;
  /**
   * onSuccess callback when a resource is successfully shared
   */
  onSuccess: () => void;
}

export type SelectOptionProps = HTMLAttributes<HTMLLIElement> & { key: Key };

// useSearch

export type SearchState = {
  searchInputValue: string;
  searchResults: OptionListItemType[];
  searchAPIResults: ShareSubject[];
  isSearching: boolean;
};

export type Action =
  | { type: "onChange"; payload: string }
  | { type: "isSearching"; payload: boolean }
  | { type: "addResult"; payloads: OptionListItemType[] }
  | { type: "addApiResult"; payloads: ShareSubject[] }
  | { type: "updateSearchResult"; payloads: OptionListItemType[] }
  | { type: "emptyResult"; payloads: OptionListItemType[] };

// useShare

export interface IUseShareResourceModalProps {
  appCode: string;
  /**
   * Resource ID (assetId)
   */
  resourceId: ShareOptions["resourceId"];
  /**
   * Resource Creator Id: Id of the user who created the resource
   */
  resourceCreatorId: ShareOptions["resourceCreatorId"];
  /**
   * Resource Rights (based on the new rights array)
   */
  resourceRights: ShareOptions["resourceRights"];
  shareResource?: ShareResourceMutation;
  setIsLoading: (value: boolean) => void;
  onSuccess: () => void;
}

export type ShareState = {
  isSharing: boolean;
  shareRights: ShareRightWithVisibles;
  shareRightActions: ShareRightAction[];
};

export type ShareAction =
  | { type: "init"; payload: Partial<ShareState> }
  | { type: "updateShareRights"; payload: ShareRightWithVisibles }
  | { type: "toggleRight"; payload: ShareRightWithVisibles }
  | { type: "deleteRow"; payload: ShareRightWithVisibles }
  | { type: "isSharing"; payload: boolean };

// useShareBookmark

export interface IUseShareBookmarkProps {
  shareRights: ShareRightWithVisibles;
  shareDispatch: Dispatch<ShareAction>;
  setHasUserInterracted: Dispatch<SetStateAction<boolean>>;
}

export type BookmarkProps = {
  name: string;
  id: string;
};
