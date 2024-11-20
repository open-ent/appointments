import { isTimeInRange } from "~/components/DailySlot/utils";
import { Slot } from "~/core/types";
import { formatTimeToDayjs } from "~/core/utils/date.utils";

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
    const beginItem = formatTimeToDayjs(item.begin);
    const beginSlot = formatTimeToDayjs(updatedSlot.begin);
    const endSlot = formatTimeToDayjs(updatedSlot.end);

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
