import { FC } from "react";

import { Button, MobileStepper } from "@cgi-learning-hub/ui";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS } from "~/core/constants";
import { PAGE_TYPE } from "~/providers/GridModalProvider/enum";
import {
  backButtonStyle,
  nextButtonStyle,
  saveButtonStyle,
  stepperStyle,
} from "./style";
import { CustomStepperProps } from "./types";

export const CustomStepper: FC<CustomStepperProps> = ({
  page,
  isSubmitButtonLoading,
  handleCancel,
  handlePrev,
  handleNext,
  handleSubmit,
}) => {
  const { t } = useTranslation(APPOINTMENTS);

  return (
    <MobileStepper
      variant="dots"
      steps={2}
      position="static"
      activeStep={page}
      sx={stepperStyle}
      backButton={
        page === PAGE_TYPE.FIRST ? (
          <Button onClick={handleCancel} sx={backButtonStyle} variant="text">
            {t("appointments.cancel")}
          </Button>
        ) : (
          <Button
            onClick={handlePrev}
            startIcon={<KeyboardArrowLeft />}
            variant="text"
            sx={backButtonStyle}
          >
            {t("appointments.back")}
          </Button>
        )
      }
      nextButton={
        page === PAGE_TYPE.FIRST ? (
          <Button onClick={handleNext} sx={nextButtonStyle} variant="text">
            {t("appointments.next")}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            sx={saveButtonStyle}
            variant="contained"
            startIcon={<SaveIcon />}
            loading={isSubmitButtonLoading}
          >
            {t("appointments.save")}
          </Button>
        )
      }
    />
  );
};
