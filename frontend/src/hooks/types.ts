import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  SyntheticEvent,
} from "react";

import { SelectChangeEvent } from "@mui/material";
import { Dayjs } from "dayjs";

import { HexaColor } from "~/components/ColorPicker/types";
import { DAY, DURATION, PERIODICITY } from "~/core/enums";
import { Slot } from "~/core/types";
import {
  GridModalInputs,
  InputsErrors,
} from "~/providers/GridModalProvider/types";
import { Public } from "~/services/api/CommunicationService/types";

export interface useUpdateGridInputsReturnType {
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleColorChange: (color: HexaColor) => void;
  handleStructureChange: (event: SelectChangeEvent<unknown>) => void;
  handleLocationChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePublicChange: (_: SyntheticEvent, value: Public[]) => void;
  handleIsVideoCallChange: () => void;
  handleVideoCallLinkChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePublicCommentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleStartDateChange: (date: Dayjs | null) => void;
  handleEndDateChange: (date: Dayjs | null) => void;
  handleSlotDurationChange: (
    _: MouseEvent<HTMLElement>,
    value: DURATION,
  ) => void;
  handlePeriodicityChange: (
    _: MouseEvent<HTMLElement>,
    value: PERIODICITY,
  ) => void;
  handleAddSlot: (day: DAY) => void;
  handleDeleteSlot: (day: DAY, slotId: number) => void;
  handleSlotChange: (
    day: DAY,
    slot: Slot,
    value: string,
    type: "begin" | "end",
  ) => void;
}

export type useUpdateGridInputsType = (
  inputs: GridModalInputs,
  setInputs: Dispatch<SetStateAction<GridModalInputs>>,
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>,
  structureOptions: Structure[],
  existingGridsNames: string[],
) => useUpdateGridInputsReturnType;

export interface useBlurGridInputsReturnType {
  newNameError: string;
  newVideoCallLinkError: string;
  newValidityPeriodError: string;
  newWeekSlotsError: string;
  newSlotsError: { ids: number[]; error: string };
  handleNameBlur: () => void;
  handleVideoCallLinkBlur: () => void;
}

export type useBlurGridInputsType = (
  inputs: GridModalInputs,
  errorInputs: InputsErrors,
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>,
) => useBlurGridInputsReturnType;

export interface Structure {
  id: string;
  name: string;
}
