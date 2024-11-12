import { useMemo } from "react";

import { useUser } from "@edifice-ui/react";

import { Structure } from "./types";

export const useStructure = () => {
  const { user } = useUser();
  const structureIds = user?.structures ?? [];
  const structureNames = user?.structureNames ?? [];

  const getStructureName = (id: string): string => {
    const index = structureIds.indexOf(id);
    return structureNames[index] ?? "";
  };

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

  const isMultiStructure = structures.length > 1;

  return { isMultiStructure, structures, getStructureName };
};
