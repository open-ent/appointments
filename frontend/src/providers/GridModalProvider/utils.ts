import { PERIODICITY_VALUES } from "~/core/constants";
import { DAY, DURATION, PERIODICITY } from "~/core/enums";
import { INVALID_SLOT_ERROR } from "~/core/i18nKeys";
import { WeekSlotsModel } from "~/core/types";
import { Structure, useBlurGridInputsReturnType } from "~/hooks/types";
import { Public } from "~/services/api/CommunicationService/types";
import {
  CreateGridPayload,
  EditGridBody,
  EditGridPayload,
} from "~/services/api/GridService/types";
import { GridModalInputs, InputsErrors, MyCustomFile } from "./types";

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
  documents: [],
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

export const gridInputsToCreateGridPayload = (
  inputs: GridModalInputs,
  publicOptions: Public[],
  files: MyCustomFile[],
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
    documentsIds: files.map((file) => file.workspaceId),
    publicComment: inputs.publicComment,
  };
};

export const gridInputsToEditGridPayload = (
  inputs: GridModalInputs,
  gridId: number,
  files: MyCustomFile[],
): EditGridPayload => {
  const body: EditGridBody = {
    name: inputs.name.trimEnd(),
    color: inputs.color,
    videoCallLink: inputs.isVideoCall ? inputs.videoCallLink : "",
    place: inputs.location,
    documentsIds: files.map((file) => file.workspaceId),
    publicComment: inputs.publicComment,
  };

  return {
    gridId,
    body,
  };
};

export const newErrorInputs = (
  blurGridModalInputs: useBlurGridInputsReturnType,
): InputsErrors => ({
  name: blurGridModalInputs.newNameError,
  videoCallLink: blurGridModalInputs.newVideoCallLinkError,
  validityPeriod: blurGridModalInputs.newValidityPeriodError,
  weekSlots: blurGridModalInputs.newWeekSlotsError,
  slots: blurGridModalInputs.newSlotsError,
});

export const isErrorsEmpty = (errors: InputsErrors) =>
  !(
    errors.name ||
    errors.videoCallLink ||
    errors.validityPeriod ||
    errors.weekSlots ||
    errors.slots.ids.length
  );

export const createMyCustomFile = (file: File): MyCustomFile => {
  return {
    id: crypto.randomUUID(),
    workspaceId: "",
    file: file,
    name: file.name,
    size: file.size,
    isDeletable: true,
  };
};
