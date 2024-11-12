export interface DialogModalProps {
  open: boolean;
  title: string;
  description: string;
  handleCancel?: () => void;
  handleConfirm?: () => void;
  question?: string;
  options?: string[];
  selectedOption?: string;
}
