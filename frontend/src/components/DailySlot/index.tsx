import { FC } from "react";

import {
  Box,
  FormHelperText,
  IconButton,
  Stack,
  TimePicker,
  Typography,
} from "@cgi-learning-hub/ui";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS } from "~/core/constants";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import {
  beginAndEndBoxStyle,
  beginAndEndWrapperStyle,
  iconButtonStyle,
  iconStyle,
  StyledDailySlotBox,
  timePickerStyle,
} from "./style";
import { DailySlotProps } from "./types";
import {
  getEndMinTime,
  getErrorHelperText,
  getExtremumTimes,
  shouldDisableThisEndValue,
  shouldDisplayHelperText,
} from "./utils";

export const DailySlot: FC<DailySlotProps> = ({ day, slot }) => {
  const { t } = useTranslation(APPOINTMENTS);
  const {
    inputs: { duration },
    errorInputs: { slots },
    updateGridModalInputs: { handleDeleteSlot, handleSlotChange },
    modalType,
    isSubmitButtonLoading,
  } = useGridModal();
  const { beginMin, beginMax, endMin, endMax } = getExtremumTimes(duration);
  const isSlotError =
    slots.ids.some((item) => item === slot.id) &&
    (!slot.begin.time || !slot.end.time);
  const isDisabled =
    isSubmitButtonLoading || modalType === GRID_MODAL_TYPE.CONSULTATION;

  return (
    <StyledDailySlotBox isSlotError={isSlotError}>
      <Stack direction="row" gap={1} sx={{ width: "fit-content" }}>
        <Box sx={beginAndEndWrapperStyle}>
          <Box sx={beginAndEndBoxStyle}>
            <Typography noWrap width="20%">
              {t("appointments.from") + " :"}
            </Typography>
            <TimePicker
              minTime={beginMin}
              maxTime={beginMax}
              defaultValue={beginMin}
              value={slot.begin.parseToDayjsOrDefault(null)}
              onChange={(newValue) =>
                handleSlotChange(day, slot, newValue, "begin")
              }
              disabled={isDisabled}
              sx={timePickerStyle}
              closeOnSelect
              skipDisabled
            />
          </Box>
          <Box sx={beginAndEndBoxStyle}>
            <Typography noWrap width="20%">
              {t("appointments.to") + " :"}
            </Typography>
            <TimePicker
              minTime={getEndMinTime(
                slot.begin.parseToDayjsOrDefault(null),
                duration,
              )}
              maxTime={endMax}
              defaultValue={endMin}
              shouldDisableTime={(value, view) =>
                shouldDisableThisEndValue(
                  value,
                  slot.begin,
                  duration,
                  endMax,
                  view,
                )
              }
              value={slot.end.parseToDayjsOrDefault(null)}
              onChange={(newValue) =>
                handleSlotChange(day, slot, newValue, "end")
              }
              disabled={isDisabled}
              sx={timePickerStyle}
              closeOnSelect
              skipDisabled
            />
          </Box>
        </Box>
        {modalType !== GRID_MODAL_TYPE.CONSULTATION && (
          <IconButton
            onClick={() => handleDeleteSlot(day, slot.id)}
            sx={iconButtonStyle}
            disabled={isDisabled}
          >
            <DeleteIcon sx={iconStyle} />
          </IconButton>
        )}
      </Stack>
      {shouldDisplayHelperText(slot.begin, slot.end, duration) && (
        <FormHelperText error sx={{ maxWidth: "350px" }}>
          {getErrorHelperText(slot.begin, duration)}
        </FormHelperText>
      )}
    </StyledDailySlotBox>
  );
};
