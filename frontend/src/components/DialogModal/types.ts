import { CONFIRM_MODAL_TYPE } from "~/core/enums";

export interface DialogModalProps {
  open: boolean;
  type: CONFIRM_MODAL_TYPE;
  showOptions?: boolean;
  handleCancel: () => void;
  handleConfirm: (option?: string) => void;
}
