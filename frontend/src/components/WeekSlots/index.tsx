import { FC, useMemo } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  Divider,
  FormHelperText,
  IconButton,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  dayBoxStyle,
  dayLabelStyle,
  errorStyle,
  iconStyle,
  slotsBoxStyle,
  weekBoxStyle,
} from "./style";
import { DailySlot } from "../DailySlot";
import { DAY } from "~/core/enums";
import { formatDayToI18n } from "~/core/utils";
import { useGridModalProvider } from "~/providers/GridModalProvider";

export const WeekSlots: FC = () => {
  const { t } = useTranslation("appointments");
  const {
    inputs,
    errorInputs: { slots },
    updateGridModalInputs: { handleAddSlot },
  } = useGridModalProvider();

  const dayErrors = useMemo(() => {
    const errors: Record<DAY, boolean> = {} as Record<DAY, boolean>;
    for (const day of Object.keys(inputs.weekSlots) as DAY[]) {
      errors[day] = inputs.weekSlots[day].some(
        (slot) => slots.ids.includes(slot.id) && (!slot.begin || !slot.end),
      );
    }
    return errors;
  }, [inputs.weekSlots, slots]);

  return (
    <Box sx={weekBoxStyle}>
      {Object.keys(inputs.weekSlots).map((day) => (
        <>
          <Box sx={dayBoxStyle} key={day}>
            <Typography sx={dayLabelStyle}>
              {t(formatDayToI18n(DAY[day as keyof typeof DAY]))}
            </Typography>
            <Divider flexItem variant="middle" orientation="vertical" />
            <Box>
              <Box sx={slotsBoxStyle}>
                {inputs.weekSlots[day as DAY].map((slot) => (
                  <DailySlot key={slot.id} day={day as DAY} slot={slot} />
                ))}
                <IconButton onClick={() => handleAddSlot(day as DAY)}>
                  <AddCircleIcon sx={iconStyle} />
                </IconButton>
              </Box>
              {dayErrors[day as DAY] && (
                <FormHelperText sx={errorStyle} error>
                  {t(slots.error)}
                </FormHelperText>
              )}
            </Box>
          </Box>
        </>
      ))}
    </Box>
  );
};
