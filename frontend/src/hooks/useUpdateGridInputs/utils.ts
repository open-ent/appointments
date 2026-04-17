import { isTimeInRange } from "~/components/DailySlot/utils";
import { MAX_STRING_LENGTH } from "~/core/constants";
import {
  SLOT_DURATION_OUTRANGE_ERROR,
  SLOT_DURATION_VALUE_ERROR,
} from "~/core/i18nKeys";
import { Slot } from "~/core/types";
import { IDurationProps } from "~/providers/GridModalProvider/types";

export const handleConflictingSlot = (
  item: Slot,
  updatedSlot: Slot,
  type: "begin" | "end",
) => {
  if (
    type === "begin" &&
    !item.end &&
    item.begin &&
    updatedSlot.begin &&
    updatedSlot.end
  ) {
    const beginItem = item.begin.parseToDayjs();
    const beginSlot = updatedSlot.begin.parseToDayjs();
    const endSlot = updatedSlot.end.parseToDayjs();

    if (
      isTimeInRange(beginItem, beginSlot, endSlot) ||
      beginItem.isSame(beginSlot)
    ) {
      return {
        ...item,
        begin: null,
      };
    }
  }
  return item;
};

export const formatString = (value: string) => {
  return value
    .replace(/\s{2,}/g, " ") // Remove multiple spaces
    .trimStart() // Remove spaces at the beginning and end
    .slice(0, MAX_STRING_LENGTH); // Limit to 250 characters
};

export const getMinuteDurationErrorValue = (
  value: number,
  durations: IDurationProps,
): string => {
  if (
    (value == 0 && durations.hours == 0) ||
    (durations.hours == 4 && value > 0)
  )
    return SLOT_DURATION_OUTRANGE_ERROR;
  if (value % 5 != 0) return SLOT_DURATION_VALUE_ERROR;
  return "";
};
