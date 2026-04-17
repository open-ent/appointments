import dayjs from "dayjs";

import { DAY } from "~/core/enums";
import { Time } from "~/core/models/Time";
import { WeekSlotsModel } from "~/core/types";
import {
  GridModalInputs,
  IDurationProps,
} from "~/providers/GridModalProvider/types";
import {
  GetGridByIdResponse,
  GridInfos,
  GridInfosResponse,
  MyGrids,
  MyGridsResponse,
} from "./types";

export const transformResponseToMyGridsResponse = (
  response: MyGridsResponse,
): MyGrids => {
  const myGrids: MyGrids = {
    total: response.total,
    grids: response.minimalCreatorGrids.map((grid) => ({
      ...grid,
      beginDate: dayjs(grid.beginDate),
      endDate: dayjs(grid.endDate),
    })),
  };
  return myGrids;
};

export const transformResponseToCompleteGridResponse = (
  response: GetGridByIdResponse,
): GridModalInputs => {
  return {
    name: response.name,
    color: response.color,
    structure: response.structure,
    location: response.place,
    public: response.groups.map((group) => ({
      groupId: group.id,
      groupName: group.name,
    })),
    isVideoCall: !!response.videoCallLink,
    videoCallLink: response.videoCallLink,
    publicComment: response.publicComment,
    validityPeriod: {
      start: dayjs(response.beginDate),
      end: dayjs(response.endDate),
    },
    duration: extractDurationObjectFromString(response.duration),
    periodicity: response.periodicity,
    weekSlots: response.dailySlots.reduce(
      (acc, dailySlot) => {
        acc[dailySlot.day] = [
          ...(acc[dailySlot.day] || []),
          {
            id: dailySlot.id,
            begin: new Time({
              hour: parseInt(dailySlot.beginTime.split(":")[0], 0),
              minute: parseInt(dailySlot.beginTime.split(":")[1], 0),
            }),
            end: new Time({
              hour: parseInt(dailySlot.endTime.split(":")[0], 0),
              minute: parseInt(dailySlot.endTime.split(":")[1], 0),
            }),
          },
        ];
        return acc;
      },
      {
        [DAY.MONDAY]: [],
        [DAY.TUESDAY]: [],
        [DAY.WEDNESDAY]: [],
        [DAY.THURSDAY]: [],
        [DAY.FRIDAY]: [],
        [DAY.SATURDAY]: [],
      } as WeekSlotsModel,
    ),
    documents: response.documents,
  };
};

export const transformResponseToGridInfosResponse = (
  response: GridInfosResponse,
): GridInfos => {
  return {
    ...response,
    duration: extractDurationObjectFromString(response.duration),
  };
};

export const extractDurationObjectFromString = (
  durationString: string,
): IDurationProps => {
  return {
    hours: parseInt(durationString.substring(0, durationString.indexOf(":"))),
    minutes: parseInt(
      durationString.substring(durationString.indexOf(":") + 1),
    ),
  };
};
