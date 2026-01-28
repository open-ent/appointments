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

import { APPOINTMENTS, DAY_VALUES } from "~/core/constants";
import { DAY } from "~/core/enums";
import { Slot } from "~/core/types";
import { useGridModal } from "~/providers/GridModalProvider";
import { DailySlot } from "../DailySlot";
import {
  dayBoxStyle,
  dayLabelStyle,
  dividerStyle,
  errorStyle,
  iconStyle,
  slotsBoxStyle,
  weekBoxStyle,
} from "./style";

export const WeekSlots: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);
  const {
    inputs,
    errorInputs: { slots },
    updateGridModalInputs: { handleAddSlot },
    isSubmitButtonLoading,
  } = useGridModal();

  const entries = Object.entries(inputs.weekSlots) as [DAY, Slot[]][];

  const filteredEntries = useMemo(() => {
    const { start, end } = inputs.validityPeriod;
    if (!start || !end) return entries;

    const startDay = start.isoWeekday();
    const endDay = end.isoWeekday();
    const diffDays = end.diff(start, "day");

    if (diffDays >= 6) return entries;

    return entries.filter(([day]) => {
      const dayjsIndex = DAY_VALUES[day].dayjsDayIndex;

      if (endDay < startDay) {
        return dayjsIndex >= startDay || dayjsIndex <= endDay;
      }

      return dayjsIndex >= startDay && dayjsIndex <= endDay;
    });
  }, [entries, inputs.validityPeriod]);

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
      {filteredEntries.map(([day, timeSlots]) => {
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
                  {
                    <IconButton
                      disabled={isSubmitButtonLoading}
                      onClick={() => handleAddSlot(day)}
                    >
                      <AddCircleIcon sx={iconStyle} />
                    </IconButton>
                  }
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
