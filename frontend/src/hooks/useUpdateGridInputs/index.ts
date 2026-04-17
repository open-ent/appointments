import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
} from "react";

import { SelectChangeEvent } from "@cgi-learning-hub/ui";
import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { HexaColor } from "~/components/ColorPicker/types";
import { MAX_STRING_LENGTH } from "~/core/constants";
import { DAY, PERIODICITY } from "~/core/enums";
import {
  FIELD_REQUIRED_ERROR,
  INVALID_SLOT_ERROR,
  SAME_GRID_ALREADY_EXISTS_ERROR,
  SLOT_DURATION_VALUE_ERROR,
} from "~/core/i18nKeys";
import { Time } from "~/core/models/Time";
import { Slot } from "~/core/types";
import {
  GridModalInputs,
  InputsErrors,
} from "~/providers/GridModalProvider/types";
import {
  initialPublic,
  initialWeekSlots,
} from "~/providers/GridModalProvider/utils";
import { Public } from "~/services/api/CommunicationService/types";
import { Structure, useUpdateGridInputsType } from "../types";
import {
  formatString,
  getMinuteDurationErrorValue,
  handleConflictingSlot,
} from "./utils";

export const useUpdateGridInputs: useUpdateGridInputsType = (
  inputs: GridModalInputs,
  setIsPublicCommentOverLimit: Dispatch<SetStateAction<boolean>>,
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
    if (existingGridsNames.includes(newName.trimEnd())) {
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
    const newLocation = formatString(e.target.value);
    updateInputField("location", newLocation);
    if (!inputs.isVideoCall && !newLocation.length) {
      return updateErrorInputs("location", FIELD_REQUIRED_ERROR);
    }
    updateErrorInputs("location", "");
  };

  const handlePublicChange = (value: Public[]) => {
    updateInputField("public", value);
    if (value.length) updateErrorInputs("public", "");
  };

  const handleIsVideoCallChange = () => {
    if (inputs.isVideoCall && !inputs.location.length) {
      updateErrorInputs("location", FIELD_REQUIRED_ERROR);
    } else {
      updateErrorInputs("location", "");
    }
    return updateInputField("isVideoCall", !inputs.isVideoCall);
  };

  const handleVideoCallLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateInputField("videoCallLink", formatString(e.target.value));
  };

  const handlePublicCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPublicCommentOverLimit(e.target.value.length > MAX_STRING_LENGTH);
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
    if (startDate && endDate) updateErrorInputs("validityPeriod", "");
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    const startDate = inputs.validityPeriod.start;
    const endDate = date ? date : undefined;
    updateInputField("validityPeriod", {
      start: inputs.validityPeriod.start,
      end: endDate,
    });
    if (startDate && endDate) updateErrorInputs("validityPeriod", "");
  };

  const handleSlotHoursDurationChange = (value: number | null) => {
    if (value == null) return;
    updateInputField("duration", {
      hours: value,
      minutes: inputs.duration.minutes,
    });
    updateInputField("weekSlots", initialWeekSlots);
    setErrorInputs((prevInputs) => ({
      ...prevInputs,
      duration: {
        hours:
          value == 0 && inputs.duration.minutes == 0
            ? SLOT_DURATION_VALUE_ERROR
            : "",
        minutes: prevInputs.duration.minutes,
      },
    }));
  };

  const handleSlotMinutesDurationChange = (value: number | null) => {
    if (value == null) return;
    updateInputField("duration", {
      hours: inputs.duration.hours,
      minutes: value,
    });
    updateInputField("weekSlots", initialWeekSlots);
    setErrorInputs((prevInputs) => ({
      ...prevInputs,
      duration: {
        hours: prevInputs.duration.hours,
        minutes: getMinuteDurationErrorValue(value, inputs.duration),
      },
    }));
  };

  const handlePeriodicityChange = (
    _: MouseEvent<HTMLElement>,
    value: PERIODICITY,
  ) => {
    updateInputField("periodicity", value);
  };

  const handleAddSlot = (day: DAY) => {
    const newDaySlotsErrorIds = inputs.weekSlots[day].reduce(
      (acc, slot) =>
        !slot.begin.time || !slot.end.time ? [...acc, slot.id] : acc,
      [] as number[],
    );

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
          begin: new Time(null),
          end: new Time(null),
        },
      ],
    });
    updateErrorInputs("weekSlots", "");
  };

  const handleDeleteSlot = (day: DAY, slotId: number) => {
    updateInputField("weekSlots", {
      ...inputs.weekSlots,
      [day]: inputs.weekSlots[day].filter((slot) => slot.id !== slotId),
    });
  };

  const handleSlotChange = (
    day: DAY,
    slot: Slot,
    value: Dayjs,
    type: "begin" | "end",
  ) => {
    const updatedSlot = {
      ...slot,
      [type]: new Time({ hour: value.hour(), minute: value.minute() }),
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
    handleIsVideoCallChange,
    handleVideoCallLinkChange,
    handlePublicCommentChange,
    handleStartDateChange,
    handleEndDateChange,
    handleSlotHoursDurationChange,
    handleSlotMinutesDurationChange,
    handlePeriodicityChange,
    handleAddSlot,
    handleDeleteSlot,
    handleSlotChange,
  };
};
