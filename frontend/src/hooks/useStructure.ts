import { useCallback, useMemo } from "react";

import { useUser } from "@edifice-ui/react";

import { Structure } from "./types";

export const useStructure = () => {
  const { user } = useUser();
  const structureIds = useMemo(() => user?.structures ?? [], [user]);
  const structureNames = useMemo(() => user?.structureNames ?? [], [user]);

  const getStructureNameById = useCallback(
    (id: string): string => {
      const index = structureIds.indexOf(id);
      return structureNames[index] ?? "";
    },
    [structureIds, structureNames],
  );

  const structures: Structure[] = useMemo(() => {
    if (structureIds.length !== structureNames.length) {
      throw new Error(
        "Structures and structureNames arrays must have the same length",
      );
    }
    return structureIds.map((structureId, index) => ({
      id: structureId,
      name: structureNames[index],
    }));
  }, [structureIds, structureNames]);

  const isMultiStructure = useMemo(() => structures.length > 1, [structures]);

  return { isMultiStructure, structures, getStructureNameById };
};
