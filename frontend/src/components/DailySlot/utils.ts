import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";

import { SLOT_DURATION } from "~/core/enums";
import { Slot, Time, TimeObject } from "~/core/types";
import { formatSlotDurationToMinutes, formatTimeToDayjs } from "~/core/utils";

dayjs.extend(duration);
dayjs.extend(isBetween);

export const formatTime = (time: Time): string => {
  if (!time) {
    return "--:--";
  }

  const hour = time.hour.toString().padStart(2, "0");
  const minute = time.minute.toString().padStart(2, "0");

  return `${hour}:${minute}`;
};

const isTimeInRange = (time: Dayjs, start: Dayjs, end: Dayjs): boolean => {
  if (!time || !start || !end) {
    return false;
  }
  return time.isAfter(start) && time.isBefore(end);
};

export const generateTimeSlots = (
  intervalInMinutes: number,
  isEnd: boolean,
): TimeObject[] => {
  const start = dayjs().startOf("day");

  const totalMinutesInDay = 1440;
  const totalIntervals = Math.floor(totalMinutesInDay / intervalInMinutes) - 1;

  return Array.from({ length: totalIntervals }, (_, i) => {
    const currentTime = start.add(
      (isEnd ? i + 1 : i) * intervalInMinutes,
      "minute",
    );
    return {
      hour: currentTime.hour(),
      minute: currentTime.minute(),
    } as TimeObject;
  });
};

export const getStartOptions = (
  slots: Slot[],
  slotDuration: SLOT_DURATION,
): Time[] => {
  const intervalMinutes: number = formatSlotDurationToMinutes(slotDuration);

  const possibleTimes: TimeObject[] = generateTimeSlots(intervalMinutes, false);

  const availableTimes = possibleTimes.filter((time: TimeObject) => {
    return !slots.some((slot) => {
      if (!slot.begin || !slot.end) {
        return false;
      }
      const currentTime = formatTimeToDayjs(time);
      const startTime = formatTimeToDayjs(slot.begin);
      const endTime = formatTimeToDayjs(slot.end);
      return (
        isTimeInRange(currentTime, startTime, endTime) ||
        currentTime.isSame(startTime)
      );
    });
  });

  return availableTimes;
};

export const getEndOptions = (
  slots: Slot[],
  slotDuration: SLOT_DURATION,
  currentSlot: Slot,
): Time[] => {
  const intervalMinutes: number = formatSlotDurationToMinutes(slotDuration);

  const possibleTimes: TimeObject[] = generateTimeSlots(intervalMinutes, true);

  const beginTime = currentSlot.begin;
  const maxEndTimes = beginTime
    ? slots
        .filter((slot) => {
          return (
            slot.begin &&
            slot.end &&
            beginTime &&
            formatTimeToDayjs(slot.begin).isAfter(formatTimeToDayjs(beginTime))
          );
        })
        .reduce<Dayjs | null>(
          (acc, slot) => {
            if (!slot.begin) {
              return acc;
            }
            const slotBegin = formatTimeToDayjs(slot.begin);
            return acc === null || slotBegin.isBefore(acc) ? slotBegin : acc;
          },
          null as Dayjs | null,
        )
    : null;

  const availableTimes = possibleTimes.filter((time: TimeObject) => {
    return !slots.some((slot) => {
      if (!slot.begin || !slot.end) {
        return false;
      }
      const currentTime = formatTimeToDayjs(time);
      const startTime = formatTimeToDayjs(slot.begin);
      const endTime = formatTimeToDayjs(slot.end);
      return (
        isTimeInRange(currentTime, startTime, endTime) ||
        currentTime.isSame(endTime)
      );
    });
  });

  const availableTimes2 = availableTimes.filter((time: TimeObject) => {
    const currentTime = formatTimeToDayjs(time);

    if (!beginTime) {
      return true;
    }
    return currentTime.isAfter(formatTimeToDayjs(beginTime));
  });

  const availableTimes3 = availableTimes2.filter((time: TimeObject) => {
    if (!maxEndTimes) {
      return true;
    }
    const currentTime = formatTimeToDayjs(time);
    return maxEndTimes.isAfter(currentTime) || maxEndTimes.isSame(currentTime);
  });

  return availableTimes3;
};
