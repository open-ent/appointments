import dayjs from "dayjs";

import { GridInfoType, tmpSlotsType } from "./types";
import { DAY, SLOT_DURATION } from "~/core/enums";

export const gridsName = ["grid1", "grid2", "grid3"];

export const gridsInfos: Record<string, GridInfoType> = {
  grid1: {
    visio: true,
    slotDuration: SLOT_DURATION.FIFTEEN_MINUTES,
    location: "Paris",
    publicComment: "Public comment grille 1",
  },
  grid2: {
    visio: false,
    slotDuration: SLOT_DURATION.THIRTY_MINUTES,
    location: "Lyon",
    publicComment: "Public comment grille 2",
  },
  grid3: {
    visio: true,
    slotDuration: SLOT_DURATION.ONE_HOUR,
    location: "Marseille",
    publicComment: "Public comment grille 3",
  },
};

export const gridsTimeSlots: Record<string, tmpSlotsType[]> = {
  grid1: [
    {
      weekDay: DAY.MONDAY,
      day: dayjs().startOf("week").add(1, "day"), // Lundi
      slots: [
        {
          id: "2023-11-20_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 9, minute: 15 },
        },
        {
          id: "2023-11-20_10_30",
          begin: { hour: 10, minute: 30 },
          end: { hour: 10, minute: 45 },
        },
        {
          id: "2023-11-20_11_0",
          begin: { hour: 11, minute: 0 },
          end: { hour: 11, minute: 15 },
        },
        {
          id: "2023-11-20_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 12, minute: 15 },
        },
      ],
    },
    {
      weekDay: DAY.TUESDAY,
      day: dayjs().startOf("week").add(2, "day"), // Mardi
      slots: [],
    },
    {
      weekDay: DAY.WEDNESDAY,
      day: dayjs().startOf("week").add(3, "day"), // Mercredi
      slots: [
        {
          id: "2023-11-22_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 9, minute: 15 },
        },
        {
          id: "2023-11-22_10_0",
          begin: { hour: 10, minute: 0 },
          end: { hour: 10, minute: 15 },
        },
        {
          id: "2023-11-22_19_0",
          begin: { hour: 19, minute: 0 },
          end: { hour: 19, minute: 15 },
        },
        {
          id: "2023-11-22_20_0",
          begin: { hour: 20, minute: 0 },
          end: { hour: 20, minute: 15 },
        },
      ],
    },
    {
      weekDay: DAY.THURSDAY,
      day: dayjs().startOf("week").add(4, "day"), // Jeudi
      slots: [
        {
          id: "2023-11-23_8_45",
          begin: { hour: 8, minute: 45 },
          end: { hour: 9, minute: 0 },
        },
        {
          id: "2023-11-23_12_30",
          begin: { hour: 12, minute: 30 },
          end: { hour: 12, minute: 45 },
        },
        {
          id: "2023-11-23_16_0",
          begin: { hour: 16, minute: 0 },
          end: { hour: 16, minute: 15 },
        },
        {
          id: "2023-11-23_20_0",
          begin: { hour: 20, minute: 0 },
          end: { hour: 20, minute: 15 },
        },
      ],
    },
    {
      weekDay: DAY.FRIDAY,
      day: dayjs().startOf("week").add(5, "day"), // Vendredi
      slots: [
        {
          id: "2023-11-24_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 9, minute: 15 },
        },
        {
          id: "2023-11-24_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 12, minute: 15 },
        },
        {
          id: "2023-11-24_13_0",
          begin: { hour: 13, minute: 0 },
          end: { hour: 13, minute: 15 },
        },
        {
          id: "2023-11-24_15_0",
          begin: { hour: 15, minute: 0 },
          end: { hour: 15, minute: 15 },
        },
        {
          id: "2023-11-24_16_0",
          begin: { hour: 16, minute: 0 },
          end: { hour: 16, minute: 15 },
        },
        {
          id: "2023-11-24_17_0",
          begin: { hour: 17, minute: 0 },
          end: { hour: 17, minute: 15 },
        },
        {
          id: "2023-11-24_18_0",
          begin: { hour: 18, minute: 0 },
          end: { hour: 18, minute: 15 },
        },
        {
          id: "2023-11-24_19_0",
          begin: { hour: 19, minute: 0 },
          end: { hour: 19, minute: 15 },
        },
        {
          id: "2023-11-24_20_0",
          begin: { hour: 20, minute: 0 },
          end: { hour: 20, minute: 15 },
        },
        {
          id: "2023-11-24_21_0",
          begin: { hour: 21, minute: 0 },
          end: { hour: 21, minute: 15 },
        },
        {
          id: "2023-11-24_22_0",
          begin: { hour: 22, minute: 0 },
          end: { hour: 22, minute: 15 },
        },
        {
          id: "2023-11-24_23_0",
          begin: { hour: 23, minute: 0 },
          end: { hour: 23, minute: 15 },
        },
        {
          id: "2023-11-24_24_0",
          begin: { hour: 24, minute: 0 },
          end: { hour: 24, minute: 15 },
        },
      ],
    },
    {
      weekDay: DAY.SATURDAY,
      day: dayjs().startOf("week").add(6, "day"), // Samedi
      slots: [
        {
          id: "2023-11-25_10_30",
          begin: { hour: 10, minute: 30 },
          end: { hour: 10, minute: 45 },
        },
        {
          id: "2023-11-25_13_0",
          begin: { hour: 13, minute: 0 },
          end: { hour: 13, minute: 15 },
        },
        {
          id: "2023-11-25_14_0",
          begin: { hour: 14, minute: 0 },
          end: { hour: 14, minute: 15 },
        },
        {
          id: "2023-11-25_15_0",
          begin: { hour: 15, minute: 0 },
          end: { hour: 15, minute: 15 },
        },
        {
          id: "2023-11-25_16_0",
          begin: { hour: 16, minute: 0 },
          end: { hour: 16, minute: 15 },
        },
        {
          id: "2023-11-25_17_0",
          begin: { hour: 17, minute: 0 },
          end: { hour: 17, minute: 15 },
        },
        {
          id: "2023-11-25_18_0",
          begin: { hour: 18, minute: 0 },
          end: { hour: 18, minute: 15 },
        },
        {
          id: "2023-11-25_19_0",
          begin: { hour: 19, minute: 0 },
          end: { hour: 19, minute: 15 },
        },
        {
          id: "2023-11-25_20_0",
          begin: { hour: 20, minute: 0 },
          end: { hour: 20, minute: 15 },
        },
      ],
    },
  ],
  grid2: [
    {
      weekDay: DAY.MONDAY,
      day: dayjs().startOf("week").add(1, "day"), // Lundi
      slots: [
        {
          id: "2023-11-20_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 9, minute: 30 },
        },
        {
          id: "2023-11-20_10_30",
          begin: { hour: 10, minute: 30 },
          end: { hour: 11, minute: 0 },
        },
      ],
    },
    {
      weekDay: DAY.TUESDAY,
      day: dayjs().startOf("week").add(2, "day"), // Mardi
      slots: [
        {
          id: "2023-11-21_8_45",
          begin: { hour: 8, minute: 45 },
          end: { hour: 9, minute: 15 },
        },
        {
          id: "2023-11-21_10_30",
          begin: { hour: 10, minute: 30 },
          end: { hour: 11, minute: 0 },
        },
        {
          id: "2023-11-21_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 12, minute: 30 },
        },
        {
          id: "2023-11-21_16_0",
          begin: { hour: 16, minute: 0 },
          end: { hour: 16, minute: 30 },
        },
        {
          id: "2023-11-21_19_0",
          begin: { hour: 19, minute: 0 },
          end: { hour: 19, minute: 30 },
        },
      ],
    },
    {
      weekDay: DAY.WEDNESDAY,
      day: dayjs().startOf("week").add(3, "day"), // Mercredi
      slots: [
        {
          id: "2023-11-22_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 9, minute: 30 },
        },
        {
          id: "2023-11-22_10_0",
          begin: { hour: 10, minute: 0 },
          end: { hour: 10, minute: 30 },
        },
        {
          id: "2023-11-22_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 12, minute: 30 },
        },
        {
          id: "2023-11-22_17_0",
          begin: { hour: 17, minute: 0 },
          end: { hour: 17, minute: 30 },
        },
        {
          id: "2023-11-22_20_0",
          begin: { hour: 20, minute: 0 },
          end: { hour: 20, minute: 30 },
        },
      ],
    },
    {
      weekDay: DAY.THURSDAY,
      day: dayjs().startOf("week").add(4, "day"), // Jeudi
      slots: [
        {
          id: "2023-11-23_8_45",
          begin: { hour: 8, minute: 45 },
          end: { hour: 9, minute: 15 },
        },
        {
          id: "2023-11-23_12_30",
          begin: { hour: 12, minute: 30 },
          end: { hour: 13, minute: 0 },
        },
        {
          id: "2023-11-23_16_0",
          begin: { hour: 16, minute: 0 },
          end: { hour: 16, minute: 30 },
        },
        {
          id: "2023-11-23_20_0",
          begin: { hour: 20, minute: 0 },
          end: { hour: 20, minute: 30 },
        },
      ],
    },
    {
      weekDay: DAY.FRIDAY,
      day: dayjs().startOf("week").add(5, "day"), // Vendredi
      slots: [
        {
          id: "2023-11-24_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 9, minute: 30 },
        },
        {
          id: "2023-11-24_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 12, minute: 30 },
        },
        {
          id: "2023-11-24_13_0",
          begin: { hour: 13, minute: 0 },
          end: { hour: 13, minute: 30 },
        },
        {
          id: "2023-11-24_15_0",
          begin: { hour: 15, minute: 0 },
          end: { hour: 15, minute: 30 },
        },
        {
          id: "2023-11-24_16_0",
          begin: { hour: 16, minute: 0 },
          end: { hour: 16, minute: 30 },
        },
      ],
    },
    {
      weekDay: DAY.SATURDAY,
      day: dayjs().startOf("week").add(6, "day"), // Samedi
      slots: [
        {
          id: "2023-11-25_10_30",
          begin: { hour: 10, minute: 30 },
          end: { hour: 11, minute: 0 },
        },
        {
          id: "2023-11-25_13_0",
          begin: { hour: 13, minute: 0 },
          end: { hour: 13, minute: 30 },
        },
      ],
    },
  ],

  grid3: [
    {
      weekDay: DAY.MONDAY,
      day: dayjs().startOf("week").add(1, "day"), // Lundi
      slots: [
        {
          id: "2023-11-20_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 10, minute: 0 },
        },
        {
          id: "2023-11-20_10_30",
          begin: { hour: 10, minute: 30 },
          end: { hour: 11, minute: 30 },
        },
        {
          id: "2023-11-20_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 13, minute: 0 },
        },
        {
          id: "2023-11-20_13_0",
          begin: { hour: 13, minute: 0 },
          end: { hour: 14, minute: 0 },
        },
      ],
    },
    {
      weekDay: DAY.TUESDAY,
      day: dayjs().startOf("week").add(2, "day"), // Mardi
      slots: [
        {
          id: "2023-11-21_8_0",
          begin: { hour: 8, minute: 0 },
          end: { hour: 9, minute: 0 },
        },
        {
          id: "2023-11-21_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 10, minute: 0 },
        },
        {
          id: "2023-11-21_17_0",
          begin: { hour: 17, minute: 0 },
          end: { hour: 18, minute: 0 },
        },
        {
          id: "2023-11-21_18_0",
          begin: { hour: 18, minute: 0 },
          end: { hour: 19, minute: 0 },
        },
        {
          id: "2023-11-21_19_0",
          begin: { hour: 19, minute: 0 },
          end: { hour: 20, minute: 0 },
        },
        {
          id: "2023-11-21_20_0",
          begin: { hour: 20, minute: 0 },
          end: { hour: 21, minute: 0 },
        },
      ],
    },
    {
      weekDay: DAY.WEDNESDAY,
      day: dayjs().startOf("week").add(3, "day"), // Mercredi
      slots: [
        {
          id: "2023-11-22_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 10, minute: 0 },
        },
        {
          id: "2023-11-22_10_0",
          begin: { hour: 10, minute: 0 },
          end: { hour: 11, minute: 0 },
        },
        {
          id: "2023-11-22_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 13, minute: 0 },
        },
        {
          id: "2023-11-22_13_0",
          begin: { hour: 13, minute: 0 },
          end: { hour: 14, minute: 0 },
        },
      ],
    },
    {
      weekDay: DAY.THURSDAY,
      day: dayjs().startOf("week").add(4, "day"), // Jeudi
      slots: [
        {
          id: "2023-11-23_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 10, minute: 0 },
        },
        {
          id: "2023-11-23_10_0",
          begin: { hour: 10, minute: 0 },
          end: { hour: 11, minute: 0 },
        },
        {
          id: "2023-11-23_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 13, minute: 0 },
        },
        {
          id: "2023-11-23_13_0",
          begin: { hour: 13, minute: 0 },
          end: { hour: 14, minute: 0 },
        },
      ],
    },
    {
      weekDay: DAY.FRIDAY,
      day: dayjs().startOf("week").add(5, "day"), // Vendredi
      slots: [
        {
          id: "2023-11-24_9_0",
          begin: { hour: 9, minute: 0 },
          end: { hour: 10, minute: 0 },
        },
        {
          id: "2023-11-24_10_0",
          begin: { hour: 10, minute: 0 },
          end: { hour: 11, minute: 0 },
        },
        {
          id: "2023-11-24_11_0",
          begin: { hour: 11, minute: 0 },
          end: { hour: 12, minute: 0 },
        },
        {
          id: "2023-11-24_12_0",
          begin: { hour: 12, minute: 0 },
          end: { hour: 13, minute: 0 },
        },
      ],
    },
    {
      weekDay: DAY.SATURDAY,
      day: dayjs().startOf("week").add(6, "day"), // Samedi
      slots: [
        {
          id: "2023-11-25_10_30",
          begin: { hour: 10, minute: 30 },
          end: { hour: 11, minute: 30 },
        },
        {
          id: "2023-11-25_13_0",
          begin: { hour: 13, minute: 0 },
          end: { hour: 14, minute: 0 },
        },
      ],
    },
  ],
};
