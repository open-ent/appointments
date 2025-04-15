import { Dispatch, SetStateAction, useCallback } from "react";

import {
  FIELD_REQUIRED_ERROR,
  INVALID_SLOT_ERROR,
  ONE_SLOT_REQUIRED_ERROR,
  SAME_GRID_ALREADY_EXISTS_ERROR,
} from "~/core/i18nKeys";
import {
  GridModalInputs,
  InputsErrors,
} from "~/providers/GridModalProvider/types";

export const useBlurGridInputs = (
  inputs: GridModalInputs,
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>,
  existingGridsNames: string[],
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

  const newNameError = inputs.name
    ? existingGridsNames.includes(inputs.name.trimEnd())
      ? SAME_GRID_ALREADY_EXISTS_ERROR
      : ""
    : FIELD_REQUIRED_ERROR;

  const newLocationError =
    inputs.location.length || inputs.isVideoCall ? "" : FIELD_REQUIRED_ERROR;

  const newVideoCallLinkError =
    inputs.isVideoCall && !inputs.videoCallLink ? FIELD_REQUIRED_ERROR : "";

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
      .reduce(
        (acc, slot) =>
          !slot.begin.time || !slot.end.time ? [...acc, slot.id] : acc,
        [] as number[],
      ),
    error: INVALID_SLOT_ERROR,
  };

  const newPublicError = inputs.public.length ? "" : FIELD_REQUIRED_ERROR;

  const handleNameBlur = () => {
    updateErrorInputs("name", newNameError);
  };

  const handleLocationBlur = () => {
    updateErrorInputs("location", newLocationError);
  };

  const handleVideoCallLinkBlur = () => {
    updateErrorInputs("videoCallLink", newVideoCallLinkError);
  };

  const handlePublicBlur = () => {
    updateErrorInputs("public", newPublicError);
  };

  return {
    newNameError,
    newLocationError,
    newVideoCallLinkError,
    newValidityPeriodError,
    newWeekSlotsError,
    newSlotsError,
    newPublicError,
    handleNameBlur,
    handleLocationBlur,
    handleVideoCallLinkBlur,
    handlePublicBlur,
  };
};
