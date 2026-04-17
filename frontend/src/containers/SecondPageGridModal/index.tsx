import { FC } from "react";

import {
  Box,
  FormHelperText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";

import { RangeDatePicker } from "~/components/RangeDatePicker";
import { WeekSlots } from "~/components/WeekSlots";
import { APPOINTMENTS, PERIODICITY_VALUES } from "~/core/constants";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { pageGridModalStyle } from "../GridModal/style";
import { itemStyle, periodicityItemStyle, validityPeriodStyle } from "./style";
import { NumberField } from "~/components/NumberField";
import {
  SLOT_DURATION_OUTRANGE_ERROR,
  SLOT_DURATION_VALUE_ERROR,
} from "~/core/i18nKeys";

export const SecondPageGridModal: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);
  const {
    inputs,
    errorInputs: { weekSlots: weekSlotsError, duration: durationErrors },
    periodicityOptions,
    updateGridModalInputs: {
      handleSlotHoursDurationChange,
      handleSlotMinutesDurationChange,
      handlePeriodicityChange,
    },
    modalType,
    isSubmitButtonLoading,
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
        <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
          <NumberField
            min={0}
            max={4}
            defaultValue={0}
            format={{ maximumFractionDigits: 0 }}
            allowWheelScrub
            value={inputs.duration.hours}
            onValueChange={(value) => {
              handleSlotHoursDurationChange(value);
            }}
            error={!!durationErrors.hours}
            disabled={
              isSubmitButtonLoading || modalType !== GRID_MODAL_TYPE.CREATION
            }
            slotProps={{ root: { sx: { width: "100px" } } }}
          />
          <Typography>{t("appointments.hours")}</Typography>
          <NumberField
            min={0}
            max={55}
            defaultValue={5}
            step={5}
            format={{ maximumFractionDigits: 0 }}
            allowWheelScrub
            value={inputs.duration.minutes}
            onValueChange={(value) => handleSlotMinutesDurationChange(value)}
            error={!!durationErrors.minutes}
            disabled={
              isSubmitButtonLoading || modalType !== GRID_MODAL_TYPE.CREATION
            }
            slotProps={{ root: { sx: { width: "100px" } } }}
          />
          <Typography>{t("appointments.minutes")}</Typography>
        </Stack>
        {!!durationErrors.hours ||
          (!!durationErrors.minutes && (
            <FormHelperText error>
              {t(
                durationErrors.minutes === SLOT_DURATION_VALUE_ERROR
                  ? SLOT_DURATION_VALUE_ERROR
                  : SLOT_DURATION_OUTRANGE_ERROR,
              )}
            </FormHelperText>
          ))}
      </Box>
      <Box sx={itemStyle}>
        <Typography>{t("appointments.grid.periodicity") + " *"}</Typography>
        <Box sx={validityPeriodStyle}>
          <ToggleButtonGroup
            disabled={
              isSubmitButtonLoading ||
              modalType === GRID_MODAL_TYPE.CONSULTATION
            }
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
          {weekSlotsError && (
            <FormHelperText error>{t(weekSlotsError)}</FormHelperText>
          )}
        </Box>
        <WeekSlots />
      </Box>
    </Box>
  );
};
