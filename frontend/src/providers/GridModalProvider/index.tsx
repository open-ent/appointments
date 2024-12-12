import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GridModalInputs,
  GridModalProviderContextProps,
  GridModalProviderProps,
  InputsErrors,
} from "./types";
import {
  durationOptions,
  initialErrorInputs,
  initialGridModalInputs,
  periodicityOptions,
} from "./utils";
import { useGlobal } from "../GlobalProvider";
import {
  useBlurGridInputsReturnType,
  useUpdateGridInputsReturnType,
} from "~/hooks/types";
import { useBlurGridInputs } from "~/hooks/useBlurGridInputs";
import { useUpdateGridInputs } from "~/hooks/useUpdateGridInputs";
import { useGetCommunicationGroupsQuery } from "~/services/api/CommunicationService";
import { useGetMyGridsNameQuery } from "~/services/api/GridService";

const GridModalProviderContext =
  createContext<GridModalProviderContextProps | null>(null);

export const useGridModal = () => {
  const context = useContext(GridModalProviderContext);
  if (!context) {
    throw new Error("useGridModal must be used within a GridModalProvider");
  }
  return context;
};

export const GridModalProvider: FC<GridModalProviderProps> = ({ children }) => {
  const { structures, hasManageRight } = useGlobal();

  const [inputs, setInputs] = useState<GridModalInputs>(
    initialGridModalInputs(structures),
  );

  useEffect(() => {
    if (structures.length)
      setInputs((prev) => ({
        ...prev,
        structure: structures[0],
      }));
  }, [structures]);

  const { data: groups, refetch: refetchGroups } =
    useGetCommunicationGroupsQuery(inputs.structure.id, {
      skip: !(inputs.structure.id && hasManageRight),
    });

  const { data: existingGridsNames } = useGetMyGridsNameQuery(undefined, {
    skip: !hasManageRight,
  });

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
    if (inputs.structure.id && hasManageRight) refetchGroups();
  }, [inputs.structure]);

  const value = useMemo<GridModalProviderContextProps>(
    () => ({
      inputs,
      setInputs,
      errorInputs,
      setErrorInputs,
      existingGridsNames: existingGridsNames ?? [],
      structureOptions: structures,
      publicOptions: groups ?? [],
      durationOptions,
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
