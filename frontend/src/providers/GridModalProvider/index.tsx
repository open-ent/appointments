import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useUser } from "@edifice-ui/react";

import {
  GridModalInputs,
  GridModalProviderContextProps,
  GridModalProviderProps,
  InputsErrors,
  Structure,
} from "./types";
import {
  initialErrorInputs,
  initialGridModalInputs,
  periodicityOptions,
  slotDurationOptions,
  userStructures,
} from "./utils";
import {
  useBlurGridInputsReturnType,
  useUpdateGridInputsReturnType,
} from "~/hooks/types";
import { useBlurGridInputs } from "~/hooks/useBlurGridInputs";
import { useUpdateGridInputs } from "~/hooks/useUpdateGridInputs";
import { useGetCommunicationGroupsQuery } from "~/services/api/communication.service";
import { useGetMyGridsNameQuery } from "~/services/api/grid.service";

const GridModalProviderContext =
  createContext<GridModalProviderContextProps | null>(null);

export const useGridModalProvider = () => {
  const context = useContext(GridModalProviderContext);
  if (!context) {
    throw new Error(
      "useGridModalProvider must be used within a GridModalProvider",
    );
  }
  return context;
};

export const GridModalProvider: FC<GridModalProviderProps> = ({ children }) => {
  const { user } = useUser();
  const structures: Structure[] = user ? userStructures(user) : [];

  const [inputs, setInputs] = useState<GridModalInputs>(
    initialGridModalInputs(structures),
  );

  const { data: groups, refetch: refetchGroups } =
    useGetCommunicationGroupsQuery(inputs.structure.id, {
      skip: !inputs.structure.id,
    });

  const { data: existingGridsNames } = useGetMyGridsNameQuery();

  const [errorInputs, setErrorInputs] =
    useState<InputsErrors>(initialErrorInputs);

  const updateGridModalInputs: useUpdateGridInputsReturnType =
    useUpdateGridInputs(
      inputs,
      setInputs,
      setErrorInputs,
      structures,
      existingGridsNames ?? [],
    );

  const blurGridModalInputs: useBlurGridInputsReturnType = useBlurGridInputs(
    inputs,
    setErrorInputs,
    existingGridsNames ?? [],
  );

  const updateFirstPageErrors = () => {
    blurGridModalInputs.handleNameBlur();
    blurGridModalInputs.handleVisioLinkBlur();
  };

  const resetInputs = () => {
    setInputs(initialGridModalInputs(structures));
    setErrorInputs(initialErrorInputs);
  };

  useEffect(() => {
    if (inputs.structure.id) refetchGroups();
  }, [inputs.structure]);

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      structure: structures.length ? structures[0] : { id: "", name: "" },
    }));
  }, [user]);

  const value = useMemo<GridModalProviderContextProps>(
    () => ({
      inputs,
      setInputs,
      errorInputs,
      setErrorInputs,
      existingGridsNames: existingGridsNames ?? [],
      structureOptions: structures,
      publicOptions: groups ?? [],
      slotDurationOptions,
      periodicityOptions,
      updateGridModalInputs,
      blurGridModalInputs,
      updateFirstPageErrors,
      resetInputs,
    }),
    [inputs, errorInputs, structures, groups, existingGridsNames],
  );

  return (
    <GridModalProviderContext.Provider value={value}>
      {children}
    </GridModalProviderContext.Provider>
  );
};
