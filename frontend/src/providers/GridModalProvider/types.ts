import { Dispatch, ReactNode, SetStateAction } from "react";

import { Dayjs } from "dayjs";

import { HexaColor } from "~/components/ColorPicker/types";
import { DURATION, PERIODICITY } from "~/core/enums";
import { WeekSlotsModel } from "~/core/types";
import {
  Structure,
  useBlurGridInputsReturnType,
  useUpdateGridInputsReturnType,
} from "~/hooks/types";
import { Public } from "~/services/api/CommunicationService/types";

export interface GridModalProviderContextProps {
  inputs: GridModalInputs;
  setInputs: Dispatch<SetStateAction<GridModalInputs>>;
  errorInputs: InputsErrors;
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>;
  existingGridsNames: string[];
  structureOptions: Structure[];
  publicOptions: Public[];
  durationOptions: DURATION[];
  periodicityOptions: PERIODICITY[];
  updateGridModalInputs: useUpdateGridInputsReturnType;
  blurGridModalInputs: useBlurGridInputsReturnType;
  updateFirstPageErrors: () => void;
  resetInputs: () => void;
}

export interface GridModalProviderProps {
  children: ReactNode;
}

export interface GridModalInputs {
  name: string;
  color: HexaColor;
  structure: Structure;
  location: string;
  public: Public[];
  isVisio: boolean;
  visioLink: string;
  publicComment: string;
  validityPeriod: {
    start: Dayjs | undefined;
    end: Dayjs | undefined;
  };
  duration: DURATION;
  periodicity: PERIODICITY;
  weekSlots: WeekSlotsModel;
}

export interface InputsErrors {
  name: string;
  visioLink: string;
  validityPeriod: string;
  weekSlots: string;
  slots: {
    ids: number[];
    error: string;
  };
}
