import { Dispatch, ReactNode, SetStateAction } from "react";

import { Dayjs } from "dayjs";

import { HexaColor } from "~/components/ColorPicker/types";
import { CONFIRM_MODAL_TYPE, DURATION, PERIODICITY } from "~/core/enums";
import { WeekSlotsModel } from "~/core/types";
import {
  Structure,
  useBlurGridInputsReturnType,
  useUpdateGridInputsReturnType,
} from "~/hooks/types";
import { Public } from "~/services/api/CommunicationService/types";
import { GRID_MODAL_TYPE, PAGE_TYPE } from "./enum";

export interface GridModalProviderContextProps {
  inputs: GridModalInputs;
  setInputs: Dispatch<SetStateAction<GridModalInputs>>;
  errorInputs: InputsErrors;
  setErrorInputs: Dispatch<SetStateAction<InputsErrors>>;
  structureOptions: Structure[];
  publicOptions: Public[];
  durationOptions: DURATION[];
  periodicityOptions: PERIODICITY[];
  updateGridModalInputs: useUpdateGridInputsReturnType;
  blurGridModalInputs: useBlurGridInputsReturnType;
  updateFirstPageErrors: () => void;
  resetInputs: () => void;
  isDisplayFirstPage: boolean;
  isDisplaySecondPage: boolean;
  handlePrev: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  isModalOpen: boolean;
  handleCancel: () => void;
  isDialogOpen: boolean;
  handleCancelDialog: () => void;
  handleConfirmDialog: () => void;
  handleDisplayGridModal: (
    type: GRID_MODAL_TYPE,
    gridId?: number,
    gridName?: string,
  ) => void;
  page: PAGE_TYPE;
  modalType: GRID_MODAL_TYPE;
  confirmModalType: CONFIRM_MODAL_TYPE;
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
  isVideoCall: boolean;
  videoCallLink: string;
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
  videoCallLink: string;
  validityPeriod: string;
  weekSlots: string;
  slots: {
    ids: number[];
    error: string;
  };
}
