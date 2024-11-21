import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  MouseEvent,
} from "react";

import { SelectChangeEvent } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { formatString, handleConflictingSlot } from "./utils";
import { Structure, useUpdateGridInputsType } from "../types";
import { HexaColor } from "~/components/ColorPicker/types";
import { DAY, PERIODICITY, SLOT_DURATION } from "~/core/enums";
import {
  INVALID_SLOT_ERROR,
  SAME_GRID_ALREADY_EXISTS_ERROR,
} from "~/core/i18nKeys";
import { Slot } from "~/core/types";
import {
  GridModalInputs,
  InputsErrors,
  Public,
} from "~/providers/GridModalProvider/types";
import {
  initialPublic,
  initialWeekSlots,
} from "~/providers/GridModalProvider/utils";

export const useUpdateGridInputs: useUpdateGridInputsType = (
  inputs: GridModalInputs,
  setInputs: Dispatch<SetStateAction<GridModalInputs>>,
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>,
  structureOptions: Structure[],
  existingGridsNames: string[],
) => {
  const updateInputField = useCallback(
    <K extends keyof GridModalInputs>(field: K, value: GridModalInputs[K]) => {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [field]: value,
      }));
    },
    [setInputs],
  );

  const updateErrorInputs = useCallback(
    <K extends keyof InputsErrors>(field: K, value: InputsErrors[K]) => {
      setErrorInputs((prevInputs) => ({
        ...prevInputs,
        [field]: value,
      }));
    },
    [setErrorInputs],
  );

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = formatString(e.target.value);
    updateInputField("name", newName);
    if (existingGridsNames.includes(newName)) {
      updateErrorInputs("name", SAME_GRID_ALREADY_EXISTS_ERROR);
      return;
    }
    updateErrorInputs("name", "");
  };

  const handleColorChange = (color: HexaColor) => {
    updateInputField("color", color);
  };

  const handleStructureChange = (event: SelectChangeEvent<unknown>) => {
    const structure = structureOptions.find(
      (structure) => structure.id === event.target.value,
    );
    updateInputField("structure", structure || { id: "", name: "" });
    updateInputField("public", initialPublic);
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateInputField("location", formatString(e.target.value));
  };

  const handlePublicChange = (_: SyntheticEvent, value: Public[]) => {
    updateInputField("public", value);
  };

  const handleIsVisioChange = () => {
    updateInputField("isVisio", !inputs.isVisio);
  };

  const handleVisioLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateInputField("visioLink", formatString(e.target.value));
    updateErrorInputs("visioLink", "");
  };

  const handlePublicCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateInputField("publicComment", formatString(e.target.value));
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    const startDate = date ? date : undefined;
    const endDate = inputs.validityPeriod.end;
    const newEndDate =
      endDate && startDate && dayjs(startDate).isAfter(endDate)
        ? undefined
        : endDate;
    updateInputField("validityPeriod", { start: startDate, end: newEndDate });
    startDate && endDate && updateErrorInputs("validityPeriod", "");
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    const startDate = inputs.validityPeriod.start;
    const endDate = date ? date : undefined;
    updateInputField("validityPeriod", {
      start: inputs.validityPeriod.start,
      end: endDate,
    });
    startDate && endDate && updateErrorInputs("validityPeriod", "");
  };

  const handleSlotDurationChange = (
    _: MouseEvent<HTMLElement>,
    value: SLOT_DURATION,
  ) => {
    updateInputField("slotDuration", value);
    updateInputField("weekSlots", initialWeekSlots);
  };

  const handlePeriodicityChange = (
    _: MouseEvent<HTMLElement>,
    value: PERIODICITY,
  ) => {
    updateInputField("periodicity", value);
  };

  const handleAddSlot = (day: DAY) => {
    const newDaySlotsErrorIds = inputs.weekSlots[day]
      .filter((slots) => !slots.begin || !slots.end)
      .map((slots) => slots.id);

    if (newDaySlotsErrorIds.length) {
      setErrorInputs((prevInputs) => {
        const newSlotsErrorIds = [
          ...prevInputs.slots.ids,
          ...newDaySlotsErrorIds,
        ].filter((id, index, array) => array.indexOf(id) === index);
        return {
          ...prevInputs,
          slots: {
            ids: newSlotsErrorIds,
            error: INVALID_SLOT_ERROR,
          },
        };
      });
      return;
    }

    updateInputField("weekSlots", {
      ...inputs.weekSlots,
      [day]: [
        ...inputs.weekSlots[day],
        {
          id: uuidv4(),
          begin: null,
          end: null,
        },
      ],
    });
    updateErrorInputs("weekSlots", "");
  };

  const handleDeleteSlot = (day: DAY, slotId: string) => {
    updateInputField("weekSlots", {
      ...inputs.weekSlots,
      [day]: inputs.weekSlots[day].filter((slot) => slot.id !== slotId),
    });
  };

  const handleSlotChange = (
    day: DAY,
    slot: Slot,
    value: string,
    type: "begin" | "end",
  ) => {
    const [hour, minute] = value.split(":");
    const updatedSlot = {
      ...slot,
      [type]: { hour, minute },
    };
    updateInputField("weekSlots", {
      ...inputs.weekSlots,
      [day]: inputs.weekSlots[day].map((item) => {
        if (item.id !== slot.id) return item;
        return updatedSlot;
      }),
    });

    updateInputField("weekSlots", {
      ...inputs.weekSlots,
      [day]: inputs.weekSlots[day].map((item) => {
        if (item.id === slot.id) return updatedSlot;
        return handleConflictingSlot(item, updatedSlot, type);
      }),
    });
  };

  return {
    handleNameChange,
    handleColorChange,
    handleStructureChange,
    handleLocationChange,
    handlePublicChange,
    handleIsVisioChange,
    handleVisioLinkChange,
    handlePublicCommentChange,
    handleStartDateChange,
    handleEndDateChange,
    handleSlotDurationChange,
    handlePeriodicityChange,
    handleAddSlot,
    handleDeleteSlot,
    handleSlotChange,
  };
};
