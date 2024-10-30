import { Dispatch, SetStateAction, useCallback } from "react";

import {
  FIELD_REQUIRED_ERROR,
  INVALID_SLOT_ERROR,
  ONE_SLOT_REQUIRED_ERROR,
} from "~/core/i18nKeys";
import {
  GridModalInputs,
  InputsErrors,
} from "~/providers/GridModalProvider/types";

export const useBlurGridInputs = (
  inputs: GridModalInputs,
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>,
) => {
  const updateErrorInputs = useCallback(
    <K extends keyof InputsErrors>(field: K, value: InputsErrors[K]) => {
      setErrorInputs((prevInputs) => ({
        ...prevInputs,
        [field]: value,
      }));
    },
    [setErrorInputs],
  );

  const newNameError = inputs.name ? "" : FIELD_REQUIRED_ERROR;

  const newVisioLinkError =
    inputs.isVisio && !inputs.visioLink ? FIELD_REQUIRED_ERROR : "";

  const newValidityPeriodError =
    inputs.validityPeriod.start && inputs.validityPeriod.end
      ? ""
      : FIELD_REQUIRED_ERROR;

  const newWeekSlotsError = Object.values(inputs.weekSlots).every(
    (slots) => slots.length === 0,
  )
    ? ONE_SLOT_REQUIRED_ERROR
    : "";

  const newSlotsError = {
    ids: Object.values(inputs.weekSlots)
      .flatMap((slots) => slots)
      .filter((slots) => !slots.begin || !slots.end)
      .map((slots) => slots.id),
    error: INVALID_SLOT_ERROR,
  };

  const handleNameBlur = () => {
    updateErrorInputs("name", newNameError);
  };

  const handleVisioLinkBlur = () => {
    updateErrorInputs("visioLink", newVisioLinkError);
  };

  return {
    newNameError,
    newVisioLinkError,
    newValidityPeriodError,
    newWeekSlotsError,
    newSlotsError,
    handleNameBlur,
    handleVisioLinkBlur,
  };
};
