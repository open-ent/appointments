import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";

import { SLOT_DURATION } from "~/core/enums";
import { Slot, Time, TimeObject } from "~/core/types";
import {
  formatSlotDurationToMinutes,
  formatTimeToDayjs,
} from "~/core/utils/date.utils";

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

export const generateTimeSlots = (
  intervalInMinutes: number,
  isEnd: boolean,
): TimeObject[] => {
  const start = dayjs().startOf("day").add(7, "hour");
  const end = dayjs().startOf("day").add(22, "hour");

  const totalMinutesInDay = end.diff(start, "minute");
  const totalIntervals = Math.floor(totalMinutesInDay / intervalInMinutes);

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
  currentSlot: Slot,
): Time[] => {
  const intervalMinutes: number = formatSlotDurationToMinutes(slotDuration);

  const possibleTimes: TimeObject[] = generateTimeSlots(intervalMinutes, false);

  const endTime = currentSlot.end;
  const minBeginTimes = endTime
    ? slots
        .filter((slot) => {
          return (
            slot.begin &&
            slot.end &&
            endTime &&
            formatTimeToDayjs(slot.end).isBefore(formatTimeToDayjs(endTime))
          );
        })
        .reduce<Dayjs | null>((acc: Dayjs | null, slot) => {
          if (!slot.end) {
            return acc;
          }
          const slotEnd = formatTimeToDayjs(slot.end);
          return acc === null || slotEnd.isAfter(acc) ? slotEnd : acc;
        }, null)
    : null;

  const availableTimes = possibleTimes.filter((time: TimeObject) => {
    return !slots.some((slot) => {
      if (!slot.begin || !slot.end) return false;

      if (slot.id === currentSlot.id) return false;
      const currentTime = formatTimeToDayjs(time);
      const startTime = formatTimeToDayjs(slot.begin);
      const localendTime = formatTimeToDayjs(slot.end);
      return (
        isTimeInRange(currentTime, startTime, localendTime) ||
        currentTime.isSame(startTime)
      );
    });
  });

  const availableTimes2 = availableTimes.filter((time: TimeObject) => {
    const currentTime = formatTimeToDayjs(time);

    if (!endTime) return true;

    return currentTime.isBefore(formatTimeToDayjs(endTime));
  });

  const availableTimes3 = availableTimes2.filter((time: TimeObject) => {
    if (!minBeginTimes) return true;

    const currentTime = formatTimeToDayjs(time);
    return (
      minBeginTimes.isBefore(currentTime) || minBeginTimes.isSame(currentTime)
    );
  });

  return availableTimes3;
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
      if (!slot.begin || !slot.end) return false;

      if (slot.id === currentSlot.id) return false;

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

    if (!beginTime) return true;

    return currentTime.isAfter(formatTimeToDayjs(beginTime));
  });

  const availableTimes3 = availableTimes2.filter((time: TimeObject) => {
    if (!maxEndTimes) return true;

    const currentTime = formatTimeToDayjs(time);
    return maxEndTimes.isAfter(currentTime) || maxEndTimes.isSame(currentTime);
  });

  return availableTimes3;
};
