import { FC } from "react";

import {
  Box,
  FormHelperText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";

import { RangeDatePicker } from "~/components/RangeDatePicker";
import { WeekSlots } from "~/components/WeekSlots";
import {
  APPOINTMENTS,
  DURATION_VALUES,
  PERIODICITY_VALUES,
} from "~/core/constants";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { pageGridModalStyle } from "../GridModal/style";
import {
  itemStyle,
  periodicityItemStyle,
  slotDurationItemStyle,
  validityPeriodStyle,
} from "./style";

export const SecondPageGridModal: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);

  const {
    inputs,
    errorInputs,
    durationOptions,
    periodicityOptions,
    updateGridModalInputs: {
      handleSlotDurationChange,
      handlePeriodicityChange,
    },
    modalType,
  } = useGridModal();

  return (
    <Box sx={pageGridModalStyle}>
      <Box sx={itemStyle}>
        <Box>
          <Typography>
            {t("appointments.grid.validity.period") + " *"}
          </Typography>
        </Box>
        <RangeDatePicker />
      </Box>
      <Box sx={itemStyle}>
        <Typography>{t("appointments.grid.slot.duration") + " *"}</Typography>
        <Box sx={validityPeriodStyle}>
          <ToggleButtonGroup
            disabled={modalType !== GRID_MODAL_TYPE.CREATION}
            exclusive
            value={inputs.duration}
          >
            {durationOptions.map((option) => (
              <ToggleButton
                key={option}
                sx={slotDurationItemStyle}
                value={option}
                onClick={handleSlotDurationChange}
              >
                {DURATION_VALUES[option].displayValue}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Box sx={itemStyle}>
        <Typography>{t("appointments.grid.periodicity") + " *"}</Typography>
        <Box sx={validityPeriodStyle}>
          <ToggleButtonGroup
            disabled={modalType !== GRID_MODAL_TYPE.CREATION}
            exclusive
            value={inputs.periodicity}
          >
            {periodicityOptions.map((option) => (
              <ToggleButton
                key={option}
                sx={periodicityItemStyle}
                value={option}
                onClick={handlePeriodicityChange}
              >
                {t(PERIODICITY_VALUES[option].i18nKey)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Box sx={itemStyle}>
        <Box>
          <Typography>
            {t("appointments.grid.available.slots") + " *"}
          </Typography>
          {errorInputs.weekSlots && (
            <FormHelperText error>{t(errorInputs.weekSlots)}</FormHelperText>
          )}
        </Box>
        <WeekSlots />
      </Box>
    </Box>
  );
};
