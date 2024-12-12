import { isTimeInRange } from "~/components/DailySlot/utils";
import { MAX_STRING_LENGTH } from "~/core/constants";
import { Slot } from "~/core/types";

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
