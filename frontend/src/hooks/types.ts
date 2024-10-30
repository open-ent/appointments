import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  MouseEvent,
} from "react";

import { SelectChangeEvent } from "@mui/material";
import { Dayjs } from "dayjs";

import { HexaColor } from "~/components/ColorPicker/types";
import { DAY, PERIODICITY, SLOT_DURATION } from "~/core/enums";
import {
  GridModalInputs,
  InputsErrors,
  Public,
  Structure,
} from "~/providers/GridModalProvider/types";

export interface useUpdateGridInputsReturnType {
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleColorChange: (color: HexaColor) => void;
  handleStructureChange: (event: SelectChangeEvent) => void;
  handleLocationChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePublicChange: (_: SyntheticEvent, value: Public[]) => void;
  handleIsVisioChange: () => void;
  handleVisioLinkChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePublicCommentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleStartDateChange: (date: Dayjs | null) => void;
  handleEndDateChange: (date: Dayjs | null) => void;
  handleSlotDurationChange: (
    _: MouseEvent<HTMLElement>,
    value: SLOT_DURATION,
  ) => void;
  handlePeriodicityChange: (
    _: MouseEvent<HTMLElement>,
    value: PERIODICITY,
  ) => void;
  handleAddSlot: (day: DAY) => void;
  handleDeleteSlot: (day: DAY, slotId: string) => void;
  handleSlotChange: (
    day: DAY,
    slotId: string,
    value: string,
    type: "begin" | "end",
  ) => void;
}

export type useUpdateGridInputsType = (
  inputs: GridModalInputs,
  setInputs: Dispatch<SetStateAction<GridModalInputs>>,
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>,
  structureOptions: Structure[],
) => useUpdateGridInputsReturnType;

export interface useBlurGridInputsReturnType {
  newNameError: string;
  newVisioLinkError: string;
  newValidityPeriodError: string;
  newWeekSlotsError: string;
  newSlotsError: { ids: string[]; error: string };
  handleNameBlur: () => void;
  handleVisioLinkBlur: () => void;
}

export type useBlurGridInputsType = (
  inputs: GridModalInputs,
  errorInputs: InputsErrors,
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>,
) => useBlurGridInputsReturnType;
