import { GridModalInputs, InputsErrors } from "./types";
import { PERIODICITY_VALUES } from "~/core/constants";
import { DAY, DURATION, PERIODICITY } from "~/core/enums";
import { INVALID_SLOT_ERROR } from "~/core/i18nKeys";
import { WeekSlotsModel } from "~/core/types";
import { Structure } from "~/hooks/types";
import { Public } from "~/services/api/CommunicationService/types";
import { CreateGridPayload } from "~/services/api/GridService/types";

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
  isVideoCall: false,
  videoCallLink: "",
  publicComment: "",
  validityPeriod: {
    start: undefined,
    end: undefined,
  },
  duration: DURATION.FIFTEEN_MINUTES,
  periodicity: PERIODICITY.WEEKLY,
  weekSlots: initialWeekSlots,
});

export const initialErrorInputs: InputsErrors = {
  name: "",
  videoCallLink: "",
  validityPeriod: "",
  weekSlots: "",
  slots: {
    ids: [],
    error: INVALID_SLOT_ERROR,
  },
};

export const durationOptions: DURATION[] = Object.values(
  DURATION,
) as DURATION[];

export const periodicityOptions: PERIODICITY[] = Object.values(
  PERIODICITY,
) as PERIODICITY[];

export const gridInputsToGridPayload = (
  inputs: GridModalInputs,
  publicOptions: Public[],
): CreateGridPayload => {
  return {
    name: inputs.name.trimEnd(),
    color: inputs.color,
    beginDate: inputs.validityPeriod.start?.format("YYYY-MM-DD") || "",
    endDate: inputs.validityPeriod.end?.format("YYYY-MM-DD") || "",
    structureId: inputs.structure.id,
    duration: inputs.duration,
    periodicity: PERIODICITY_VALUES[inputs.periodicity].numberOfWeeks,
    targetPublicListId: inputs.public.length
      ? inputs.public.map((item) => item.groupId)
      : publicOptions.map((item) => item.groupId), // If no public is selected, all publics are selected
    dailySlots: Object.entries(inputs.weekSlots).reduce(
      (acc, [day, slots]) => {
        return [
          ...acc,
          ...slots.map((slot) => ({
            day: day as DAY,
            beginTime: slot.begin.parseToString(),
            endTime: slot.end.parseToString(),
          })),
        ];
      },
      [] as { day: DAY; beginTime: string; endTime: string }[],
    ),
    videoCallLink: inputs.isVideoCall ? inputs.videoCallLink : "",
    place: inputs.location,
    documentId: "",
    publicComment: inputs.publicComment,
  };
};
