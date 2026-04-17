import { TimeView } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";

import { DAY, HOUR, MINUTE } from "~/core/dayjs.const";
import { TIMEPICKER_VIEW } from "~/core/enums";
import { Time } from "~/core/models/Time";
import { t } from "~/i18n";
import { IDurationProps } from "~/providers/GridModalProvider/types";

dayjs.extend(duration);
dayjs.extend(isBetween);

export const isTimeInRange = (
  time: Dayjs,
  start: Dayjs,
  end: Dayjs,
): boolean => {
  if (!time || !start || !end) {
    return false;
  }
  return time.isAfter(start) && time.isBefore(end);
};

export const getNbMinutesOfduration = (duration: IDurationProps): number => {
  return duration.hours * 60 + duration.minutes;
};

const getNbMinutesFromMidnight = (value: Dayjs): number => {
  return value.hour() * 60 + value.minute();
};

export const getExtremumTimes = (duration: IDurationProps) => {
  const maxStarTimeHours = 22 - duration.hours - 1;
  const maxStarTimeMinutes = 60 - duration.minutes;
  const beginMax = dayjs()
    .startOf(DAY)
    .add(maxStarTimeHours, HOUR)
    .add(maxStarTimeMinutes, MINUTE);

  return {
    beginMin: dayjs().startOf(DAY).add(7, HOUR),
    beginMax,
    endMin: dayjs()
      .startOf(DAY)
      .add(7 + duration.hours, HOUR)
      .add(duration.minutes, MINUTE),
    endMax: dayjs().startOf(DAY).add(22, HOUR),
  };
};

export const getEndMinTime = (
  beginTime: Dayjs | null,
  duration: IDurationProps,
): Dayjs | null => {
  if (!beginTime) return null;
  return beginTime.add(duration.hours, HOUR).add(duration.minutes, MINUTE);
};

export const shouldDisableThisEndValue = (
  value: Dayjs,
  beginTime: Time,
  duration: IDurationProps,
  endMax: Dayjs,
  view: TimeView,
): boolean => {
  const nbBeginTimeMinutes = beginTime.getNbMinutesFromMidnight();
  const nbDurationMinutes = getNbMinutesOfduration(duration);
  const nbValueMinutes = getNbMinutesFromMidnight(value);

  switch (view.toString().toUpperCase()) {
    case TIMEPICKER_VIEW.HOURS:
      // Check if at least one minute of this hour can be a match
      return (
        Array.from({ length: 12 }, (_, i) => i * 5).every(
          (m) =>
            (value.hour() * 60 + m - nbBeginTimeMinutes) % nbDurationMinutes !=
            0,
        ) || value.hour() > endMax.hour()
      );
    case TIMEPICKER_VIEW.MINUTES:
      return (nbValueMinutes - nbBeginTimeMinutes) % nbDurationMinutes !== 0;
    default:
      return false;
  }
};

export const shouldDisplayHelperText = (
  beginTime: Time,
  endTime: Time,
  duration: IDurationProps,
): boolean => {
  const nbBeginTimeMinutes = beginTime.getNbMinutesFromMidnight();
  const nbEndTimeMinutes = endTime.getNbMinutesFromMidnight();
  const nbDurationMinutes = getNbMinutesOfduration(duration);
  return (nbEndTimeMinutes - nbBeginTimeMinutes) % nbDurationMinutes !== 0;
};

export const getErrorHelperText = (
  beginTime: Time,
  duration: IDurationProps,
): string => {
  return t("appointments.error.slot.time.end", {
    duration: `${duration.hours}h${duration.minutes
      .toString()
      .padStart(2, "0")}min`,
    startTime: beginTime.parseToDisplayText(),
  });
};
