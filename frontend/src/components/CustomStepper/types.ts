import { PAGE_TYPE } from "~/providers/GridModalProvider/enum";

export interface CustomStepperProps {
  page: PAGE_TYPE;
  isSubmitButtonLoading: boolean;
  handleCancel: () => void;
  handlePrev: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
}
