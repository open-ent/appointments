import { FC, useState } from "react";

import {
  Box,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import { Button } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS, CONFIRM_MODAL_VALUES } from "~/core/constants";
import {
  buttonsBoxStyle,
  buttonStyle,
  cancelButtonStyle,
  contentBoxStyle,
  modalBoxStyle,
} from "./style";
import { DialogModalProps } from "./types";

export const DialogModal: FC<DialogModalProps> = ({
  open,
  type,
  isSubmitButtonLoading = false,
  showOptions = true,
  handleCancel,
  handleConfirm,
}) => {
  const { t } = useTranslation(APPOINTMENTS);
  const title = t(CONFIRM_MODAL_VALUES[type].titleKey);
  const description = t(CONFIRM_MODAL_VALUES[type].descriptionKey);
  const question = t(CONFIRM_MODAL_VALUES[type].questionKey);
  const options = CONFIRM_MODAL_VALUES[type].options.map((option) => t(option));

  const [selectedOption, setSelectedOption] = useState<string | null>(
    options[0],
  );
  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <Modal open={open}>
      <Box sx={modalBoxStyle}>
        <Box sx={contentBoxStyle}>
          <Typography variant="h3">{title}</Typography>
          <Typography variant="h5">{description}</Typography>
          {showOptions && question && options.length && (
            <>
              <Typography variant="body1">{question}</Typography>
              <FormControl>
                <RadioGroup
                  value={selectedOption}
                  onChange={(e) => handleOptionChange(e.target.value)}
                >
                  {options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </>
          )}
          <Box sx={buttonsBoxStyle}>
            <Button onClick={handleCancel} sx={cancelButtonStyle}>
              {t("appointments.cancel")}
            </Button>
            <Button
              onClick={() => handleConfirm(selectedOption || undefined)}
              sx={buttonStyle}
              variant="contained"
              loading={isSubmitButtonLoading}
            >
              {t("appointments.confirm")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
