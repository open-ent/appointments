import {
  odeServices,
  type ShareRight,
  type ShareRightAction,
  type ShareRightActionDisplayName,
} from "@open-ent/client";
import { useUser } from "@open-ent/react";
import { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { COMMON } from "~/core/constants";
import { IUseShareResourceModalProps, ShareAction, ShareState } from "../type";
import { useShareInitialState } from "../utils";

function reducer(state: ShareState, action: ShareAction) {
  switch (action.type) {
    case "init":
      return { ...state, ...action.payload };
    case "deleteRow":
      return { ...state, shareRights: action.payload };
    case "updateShareRights":
      return { ...state, shareRights: action.payload };
    case "toggleRight":
      return { ...state, shareRights: action.payload };
    case "isSharing":
      return { ...state, isSharing: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
}

export default function useShare({
  appCode,
  resourceId,
  resourceCreatorId,
  resourceRights,
  setIsLoading,
  onSuccess,
}: IUseShareResourceModalProps) {
  const { user, avatar } = useUser();

  const { t } = useTranslation(COMMON);

  const [hasUserInterracted, setHasUserInterracted] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, useShareInitialState);

  // Fetch initial data to display sharing grid
  useEffect(() => {
    if (!resourceId) return;

    const fetchShareData = async () => {
      try {
        const [shareRightActions, shareRights] = await Promise.all([
          odeServices.share().getActionsForApp(appCode),
          odeServices.share().getRightsForResource(appCode, resourceId),
        ]);

        dispatch({
          type: "init",
          payload: {
            shareRightActions,
            shareRights,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchShareData();
  }, [resourceId, appCode, setIsLoading]);

  const currentIsAuthor = () =>
    resourceCreatorId === user?.userId ? true : false;

  const toggleRight = (
    shareRight: ShareRight,
    actionName: ShareRightActionDisplayName,
  ) => {
    const { rights, ...props } = state.shareRights;

    const newShareRights: ShareRight[] = [...rights];
    const index: number = newShareRights.findIndex(
      (x) => x.id === shareRight.id,
    );
    const actionObject = state.shareRightActions.filter(
      (shareRightAction) => shareRightAction.id === actionName,
    )[0];

    const isActionRemoving: boolean =
      newShareRights[index].actions.findIndex(
        (action) => action.id === actionName,
      ) > -1;

    if (isActionRemoving) {
      // remove selected action and actions that requires the selected action
      let updatedActions = newShareRights[index].actions.filter(
        (action) => action.id !== actionName,
      );
      const requiredActions = state.shareRightActions.filter(
        (shareRightAction) => shareRightAction.requires?.includes(actionName),
      );
      updatedActions = updatedActions.filter(
        (action) =>
          !requiredActions.find(
            (requiredAction) => requiredAction.id === action.id,
          ),
      );

      newShareRights[index] = {
        ...newShareRights[index],
        actions: updatedActions,
      };
    } else {
      // add required actions
      const requiredActions = state.shareRightActions.filter(
        (shareRightAction) =>
          actionObject.requires?.includes(shareRightAction.id) &&
          !newShareRights[index].actions.find(
            (action) => action.id === shareRightAction.id,
          ),
      );
      newShareRights[index] = {
        ...newShareRights[index],
        actions: [
          ...newShareRights[index].actions,
          actionObject,
          ...requiredActions,
        ],
      };
    }

    // if bookmark then apply right to users and groups
    if (shareRight.type === "sharebookmark") {
      newShareRights[index].users?.forEach((user: { id: string }) => {
        const userIndex = newShareRights.findIndex(
          (item) => item.id === user.id,
        );
        newShareRights[userIndex] = {
          ...newShareRights[userIndex],
          actions: newShareRights[index].actions,
        };
      });

      newShareRights[index].groups?.forEach((user: { id: string }) => {
        const userIndex = newShareRights.findIndex(
          (item) => item.id === user.id,
        );
        newShareRights[userIndex] = {
          ...newShareRights[userIndex],
          actions: newShareRights[index].actions,
        };
      });
    }

    dispatch({
      type: "toggleRight",
      payload: {
        rights: newShareRights,
        ...props,
      },
    });

    setHasUserInterracted((prev) => prev || true);
  };

  const handleDeleteRow = (shareRight: ShareRight) => {
    dispatch({
      type: "deleteRow",
      payload: {
        ...state.shareRights,
        rights: state.shareRights.rights.filter(
          (right: { id: string }) =>
            right.id !== shareRight.id &&
            !shareRight.users?.find(
              (user: { id: string }) => user.id === right.id,
            ) &&
            !shareRight.groups?.find(
              (group: { id: string }) => group.id === right.id,
            ),
        ),
      },
    });
    setHasUserInterracted((prev) => prev || true);
  };

  const handleShare = async () => {
    dispatch({
      type: "isSharing",
      payload: true,
    });

    try {
      // Prepare object to share
      const myRights = resourceRights
        .filter((right) => user && right.includes(`user:${user.userId}`))
        .map((right) => right.split(":")[2])
        .filter((right) => !!right);

      const shares = [...state.shareRights.rights];

      if (myRights.length > 0 && user) {
        const actions: ShareRightAction[] = myRights.map((right) => {
          return {
            displayName: right,
            id: right,
          } as ShareRightAction;
        });
        shares.push({
          actions,
          avatarUrl: "",
          directoryUrl: "",
          displayName: user.username,
          id: user.userId,
          type: "user",
        });
      }

      // Do share
      const result = await odeServices
        .share()
        .saveRights(appCode, resourceId, shares);

      if (Object.keys(result)[0] === "error") {
        console.error(result);
        toast.error(t("explorer.shared.status.error"));
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save share : ", error);
      toast.error(t("explorer.shared.status.error"));
    } finally {
      dispatch({
        type: "isSharing",
        payload: false,
      });
    }
  };

  return {
    state,
    dispatch,
    currentIsAuthor,
    myAvatar: avatar,
    handleDeleteRow,
    handleShare,
    toggleRight,
    hasUserInterracted,
    setHasUserInterracted,
  };
}
