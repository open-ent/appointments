import i18n from "~/i18n";
import { Public } from "~/services/api/CommunicationService/types";
import { SelectPossibility } from "./enums";

export const isOptionEqualToValue = (
  option: Public | SelectPossibility,
  value: Public,
) => {
  if (
    option === SelectPossibility.SELECT_ALL ||
    option === SelectPossibility.DESELECT_ALL
  )
    return false;
  return (option as Public).groupId === value.groupId;
};

export const getOptionLabel = (option: Public | SelectPossibility): string => {
  if (option === SelectPossibility.SELECT_ALL) {
    return i18n.t("appointments.select.all");
  }
  if (option === SelectPossibility.DESELECT_ALL) {
    return i18n.t("appointments.deselect.all");
  }
  return (option as Public).groupName;
};
