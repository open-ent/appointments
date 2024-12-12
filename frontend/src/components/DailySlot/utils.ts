import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";

import { DURATION_VALUES } from "~/core/constants";
import { DURATION } from "~/core/enums";
import { Time } from "~/core/models/Time";
import { Slot } from "~/core/types";

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

export const generateTimeSlots = (
  intervalInMinutes: number,
  isEnd: boolean,
): Time[] => {
  const start = dayjs().startOf("day").add(7, "hour");
  const end = dayjs().startOf("day").add(22, "hour");

  const totalMinutesInDay = end.diff(start, "minute");
  const totalIntervals = Math.floor(totalMinutesInDay / intervalInMinutes);

  return Array.from({ length: totalIntervals }, (_, i) => {
    const currentTime = start.add(
      (isEnd ? i + 1 : i) * intervalInMinutes,
      "minute",
    );
    return new Time({
      hour: currentTime.hour(),
      minute: currentTime.minute(),
    });
  });
};

export const getStartOptions = (
  slots: Slot[],
  duration: DURATION,
  currentSlot: Slot,
): Time[] => {
  const intervalMinutes: number = DURATION_VALUES[duration].numberOfMinutes;

  const possibleTimes: Time[] = generateTimeSlots(intervalMinutes, false);

  const endTime = currentSlot.end;
  const minBeginTimes = endTime
    ? slots
        .filter((slot) => {
          return (
            slot.begin.time &&
            slot.end.time &&
            endTime.time &&
            slot.end.parseToDayjs().isBefore(endTime.parseToDayjs())
          );
        })
        .reduce<Dayjs | null>((acc: Dayjs | null, slot) => {
          if (!slot.end.time) {
            return acc;
          }
          const slotEnd = slot.end.parseToDayjs();
          return acc === null || slotEnd.isAfter(acc) ? slotEnd : acc;
        }, null)
    : null;

  const availableTimes = possibleTimes.filter((time: Time) => {
    return !slots.some((slot) => {
      if (!slot.begin.time || !slot.end.time) return false;

      if (slot.id === currentSlot.id) return false;
      const currentTime = time.parseToDayjs();
      const startTime = slot.begin.parseToDayjs();
      const localendTime = slot.end.parseToDayjs();
      return (
        isTimeInRange(currentTime, startTime, localendTime) ||
        currentTime.isSame(startTime)
      );
    });
  });

  const availableTimes2 = availableTimes.filter((time: Time) => {
    const currentTime = time.parseToDayjs();

    if (!endTime.time) return true;

    return currentTime.isBefore(endTime.parseToDayjs());
  });

  const availableTimes3 = availableTimes2.filter((time: Time) => {
    if (!minBeginTimes) return true;

    const currentTime = time.parseToDayjs();
    return (
      minBeginTimes.isBefore(currentTime) || minBeginTimes.isSame(currentTime)
    );
  });

  return availableTimes3;
};

export const getEndOptions = (
  slots: Slot[],
  duration: DURATION,
  currentSlot: Slot,
): Time[] => {
  const intervalMinutes: number = DURATION_VALUES[duration].numberOfMinutes;

  const possibleTimes: Time[] = generateTimeSlots(intervalMinutes, true);

  const beginTime = currentSlot.begin;
  const maxEndTimes = beginTime
    ? slots
        .filter((slot) => {
          return (
            slot.begin.time &&
            slot.end.time &&
            beginTime.time &&
            slot.begin.parseToDayjs().isAfter(beginTime.parseToDayjs())
          );
        })
        .reduce<Dayjs | null>(
          (acc, slot) => {
            if (!slot.begin.time) {
              return acc;
            }
            const slotBegin = slot.begin.parseToDayjs();
            return acc === null || slotBegin.isBefore(acc) ? slotBegin : acc;
          },
          null as Dayjs | null,
        )
    : null;

  const availableTimes = possibleTimes.filter((time: Time) => {
    return !slots.some((slot) => {
      if (!slot.begin.time || !slot.end.time) return false;

      if (slot.id === currentSlot.id) return false;

      const currentTime = time.parseToDayjs();
      const startTime = slot.begin.parseToDayjs();
      const endTime = slot.end.parseToDayjs();
      return (
        isTimeInRange(currentTime, startTime, endTime) ||
        currentTime.isSame(endTime)
      );
    });
  });

  const availableTimes2 = availableTimes.filter((time: Time) => {
    const currentTime = time.parseToDayjs();

    if (!beginTime.time) return true;

    return currentTime.isAfter(beginTime.parseToDayjs());
  });

  const availableTimes3 = availableTimes2.filter((time: Time) => {
    if (!maxEndTimes) return true;

    const currentTime = time.parseToDayjs();
    return maxEndTimes.isAfter(currentTime) || maxEndTimes.isSame(currentTime);
  });

  return availableTimes3;
};
