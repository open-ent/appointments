import dayjs, { Dayjs } from "dayjs";

import { DAY_VALUES } from "~/core/constants";
import { DAY as STRING_DAY, WEEK } from "~/core/dayjs.const";
import { DAY } from "~/core/enums";
import { Time } from "~/core/models/Time";
import { TimeSlots } from "~/services/api/GridService/types";
import { DaySlots } from "./types";

import "dayjs/locale/en";

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
    .date(day);
};

const getDayOfWeek = (date: Dayjs): DAY => {
  return date.locale("en").format("dddd").toUpperCase() as DAY;
};

export const transformTimeSlotsToDaySlots = (
  timeSlots: TimeSlots,
  currentDay: Dayjs,
): DaySlots[] => {
  const daySlots: DaySlots[] = Object.values(DAY).map((day) => ({
    weekDay: day,
    day: currentDay
      .startOf(WEEK)
      .add(DAY_VALUES[day].numberOfWeekDay, STRING_DAY),
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
    day: currentDay
      .startOf(WEEK)
      .add(DAY_VALUES[day].numberOfWeekDay, STRING_DAY),
    slots: null,
  }));
};
