import { FC, useMemo } from "react";

import {
  Box,
  Divider,
  FormHelperText,
  IconButton,
  Typography,
} from "@cgi-learning-hub/ui";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useTranslation } from "react-i18next";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { APPOINTMENTS, DAY_VALUES } from "~/core/constants";
import { DAY } from "~/core/enums";
import { Slot } from "~/core/types";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { DailySlot } from "../DailySlot";
import {
  dayBoxStyle,
  dayLabelStyle,
  dividerStyle,
  errorStyle,
  iconStyle,
  noSlotStyle,
  slotsBoxStyle,
  weekBoxStyle,
} from "./style";

export const WeekSlots: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);
  const {
    inputs,
    errorInputs: { slots },
    updateGridModalInputs: { handleAddSlot },
    modalType,
    isSubmitButtonLoading,
  } = useGridModal();

  const entries = Object.entries(inputs.weekSlots) as [DAY, Slot[]][];

  const dayErrors = useMemo(() => {
    const errors: Record<DAY, boolean> = {} as Record<DAY, boolean>;
    entries.map(([day, timeSlots]) => {
      errors[day] = timeSlots.some(
        (slot) =>
          slots.ids.includes(slot.id) && (!slot.begin.time || !slot.end.time),
      );
    });
    return errors;
  }, [entries, slots.ids]);

  return (
    <Box sx={weekBoxStyle}>
      {entries.map(([day, timeSlots]) => {
        return (
          <>
            <Box sx={dayBoxStyle} key={day}>
              <Typography sx={dayLabelStyle}>
                {t(DAY_VALUES[day].i18nKey)}
              </Typography>
              <Divider
                sx={dividerStyle}
                flexItem
                variant="middle"
                orientation="vertical"
              />
              <Box>
                <Box sx={slotsBoxStyle}>
                  {timeSlots.map((slot) => (
                    <DailySlot key={slot.id} day={day} slot={slot} />
                  ))}
                  {modalType === GRID_MODAL_TYPE.CREATION ? (
                    <IconButton
                      disabled={isSubmitButtonLoading}
                      onClick={() => handleAddSlot(day)}
                    >
                      <AddCircleIcon sx={iconStyle} />
                    </IconButton>
                  ) : (
                    timeSlots.length === 0 && (
                      <Box sx={noSlotStyle}>
                        <CloseRoundedIcon />
                      </Box>
                    )
                  )}
                </Box>
                {dayErrors[day] && (
                  <FormHelperText sx={errorStyle} error>
                    {t(slots.error)}
                  </FormHelperText>
                )}
              </Box>
            </Box>
          </>
        );
      })}
    </Box>
  );
};
