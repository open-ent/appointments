import { GridModalInputs, GridPayload, InputsErrors, Public } from "./types";
import { DAY, PERIODICITY, SLOT_DURATION } from "~/core/enums";
import { INVALID_SLOT_ERROR } from "~/core/i18nKeys";
import { WeekSlotsModel } from "~/core/types";
import {
  formatSlotDurationToString,
  formatTimeToString,
} from "~/core/utils/date.utils";
import { Structure } from "~/hooks/types";

export const initialPublic: Public[] = [];
export const initialWeekSlots: WeekSlotsModel = {
  [DAY.MONDAY]: [],
  [DAY.TUESDAY]: [],
  [DAY.WEDNESDAY]: [],
  [DAY.THURSDAY]: [],
  [DAY.FRIDAY]: [],
  [DAY.SATURDAY]: [],
};

export const initialGridModalInputs = (
  structures: Structure[],
): GridModalInputs => ({
  name: "",
  color: "#f44336",
  structure: structures.length ? structures[0] : { id: "", name: "" },
  location: "",
  public: initialPublic,
  isVisio: false,
  visioLink: "",
  publicComment: "",
  validityPeriod: {
    start: undefined,
    end: undefined,
  },
  slotDuration: SLOT_DURATION.FIVETEEN_MINUTES,
  periodicity: PERIODICITY.WEEKLY,
  weekSlots: initialWeekSlots,
});

export const initialErrorInputs: InputsErrors = {
  name: "",
  visioLink: "",
  validityPeriod: "",
  weekSlots: "",
  slots: {
    ids: [],
    error: INVALID_SLOT_ERROR,
  },
};

export const slotDurationOptions: SLOT_DURATION[] = [
  SLOT_DURATION.FIVETEEN_MINUTES,
  SLOT_DURATION.THIRTY_MINUTES,
  SLOT_DURATION.FOURTYFIVE_MINUTES,
  SLOT_DURATION.ONE_HOUR,
];

export const periodicityOptions: PERIODICITY[] = [
  PERIODICITY.WEEKLY,
  PERIODICITY.BIWEEKLY,
];

export const gridInputsToGridPayload = (
  inputs: GridModalInputs,
  publicOptions: Public[],
): GridPayload => {
  return {
    name: inputs.name,
    color: inputs.color,
    beginDate: inputs.validityPeriod.start?.format("YYYY-MM-DD") || "",
    endDate: inputs.validityPeriod.end?.format("YYYY-MM-DD") || "",
    structureId: inputs.structure.id,
    duration: formatSlotDurationToString(inputs.slotDuration),
    periodicity: inputs.periodicity,
    targetPublicListId: inputs.public.length
      ? inputs.public.map((item) => item.id)
      : publicOptions.map((item) => item.id), // If no public is selected, all publics are selected
    dailySlots: Object.entries(inputs.weekSlots).reduce(
      (acc, [day, slots]) => {
        return [
          ...acc,
          ...slots.map((slot) => ({
            day: day as DAY,
            beginTime: formatTimeToString(slot.begin),
            endTime: formatTimeToString(slot.end),
          })),
        ];
      },
      [] as { day: DAY; beginTime: string; endTime: string }[],
    ),
    visioLink: inputs.isVisio ? inputs.visioLink : "",
    place: inputs.location,
    documentId: "",
    publicComment: inputs.publicComment,
  };
};
