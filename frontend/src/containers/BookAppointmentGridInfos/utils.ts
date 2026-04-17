import { IDurationProps } from "~/providers/GridModalProvider/types";

export const getDisplayDurationValue = (
  duration: IDurationProps | undefined,
): string => {
  if (!duration) return "5min";
  return `${duration.hours}h ${duration.minutes}min`;
};
