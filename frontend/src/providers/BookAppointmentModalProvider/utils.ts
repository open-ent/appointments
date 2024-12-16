import dayjs, { Dayjs } from "dayjs";

import { DaySlots } from "./types";
import { DAY_VALUES } from "~/core/constants";
import { DAY } from "~/core/enums";
import { Time } from "~/core/models/Time";
import { TimeSlots } from "~/services/api/GridService/types";

const transformStringToTime = (time: string): Time => {
  const [hour, minute] = time.split(":").map(Number);
  return new Time({ hour, minute });
};

export const transformStringToDayjs = (date: string): Dayjs => {
  // date format: "YYYY-MM-DD HH:mm"
  const [year, month, day] = date.split(" ")[0].split("-").map(Number);
  return dayjs()
    .year(year)
    .month(month - 1)
    .date(day)
    .locale("fr");
};

const getDayOfWeek = (date: Dayjs): DAY => {
  return date.format("dddd").toUpperCase() as DAY;
};

export const transformTimeSlotsToDaySlots = (
  timeSlots: TimeSlots,
  currentDay: Dayjs,
): DaySlots[] => {
  const daySlots: DaySlots[] = Object.values(DAY).map((day) => ({
    weekDay: day,
    day: currentDay.startOf("week").add(DAY_VALUES[day].numberOfWeekDay, "day"),
    slots: [],
  }));

  if (!timeSlots.timeslots) {
    return daySlots;
  }

  timeSlots.timeslots.forEach((timeSlot) => {
    const [beginDate, beginTime] = timeSlot.beginDate.split(" ");
    const [endDate, endTime] = timeSlot.endDate.split(" ");
    if (beginDate !== endDate) {
      return;
    }
    const dayOfWeek = getDayOfWeek(dayjs(beginDate));
    const slot = {
      id: timeSlot.id,
      begin: transformStringToTime(beginTime),
      end: transformStringToTime(endTime),
    };

    const daySlot = daySlots.find((day) => day.weekDay === dayOfWeek);
    if (daySlot && daySlot.slots) {
      daySlot.slots.push(slot);
    }
  });

  return daySlots;
};

export const loadingDaySlots = (currentDay: Dayjs): DaySlots[] => {
  return Object.values(DAY).map((day) => ({
    weekDay: day,
    day: currentDay.startOf("week").add(DAY_VALUES[day].numberOfWeekDay, "day"),
    slots: null,
  }));
};
