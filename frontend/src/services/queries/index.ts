import { IAction } from "@edifice.io/client";
import { useQuery } from "@tanstack/react-query";

import { sessionHasWorkflowRights } from "../api";
import { workflowRights } from "~/core/rights";

/**
 * useActions query
 * set actions correctly with workflow rights
 * @returns actions data
 */
// const { actions } = getAppParams();
export const useActions = () => {
  const { access, manage } = workflowRights;

  return useQuery<Record<string, boolean>, Error, IAction[]>({
    queryKey: ["actions"],
    queryFn: async () => {
      const availableRights = await sessionHasWorkflowRights([access, manage]);
      return availableRights;
    },
    select: (data) => {
      const actions: any[] = [
        {
          id: "access",
          workflow: access,
          available: data[access] || false,
        },
        {
          id: "manage",
          workflow: manage,
          available: data[manage] || false,
        },
      ];
      return actions;
    },
  });
};
