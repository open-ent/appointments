import { ModalType } from "./enum";
import { DisplayModalsState } from "./types";

export const initialDisplayModalsState: DisplayModalsState = {
  [ModalType.GRID]: false,
  [ModalType.CONFIRMATION]: false,
  [ModalType.EXPORT]: false,
};
