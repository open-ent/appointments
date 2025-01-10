import { FC } from "react";

import { Box, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";

import {
  appointmentsLegendStyle,
  calandarStyle,
  containerStyle,
  legendRowStyle,
  legendStyle,
  StyledDay,
  todayLegendStyle,
} from "./style";
import { CustomDateCalendarProps } from "./types";
import { isWithAcceptedAppointment } from "./utils";
import { isToday } from "~/core/utils";

export const CustomDateCalendar: FC<CustomDateCalendarProps> = ({
  acceptedAppointmentsDates,
}) => {
  const { t } = useTranslation("appointments");
  return (
    <Box sx={containerStyle}>
      <DateCalendar
        slots={{
          day: ({ day }) => {
            return (
              <StyledDay
                isWithAcceptedAppointment={isWithAcceptedAppointment(
                  day,
                  acceptedAppointmentsDates,
                )}
                isToday={isToday(day)}
              >
                {day.date()}
              </StyledDay>
            );
          },
        }}
        sx={calandarStyle}
      />
      <Box sx={legendStyle}>
        <Box sx={legendRowStyle}>
          <Box sx={todayLegendStyle}></Box>
          <Typography variant="body1">{t("appointments.today")}</Typography>
        </Box>
        <Box sx={legendRowStyle}>
          <Box sx={appointmentsLegendStyle}></Box>
          <Typography variant="body1">
            {t("appointments.appointments")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
