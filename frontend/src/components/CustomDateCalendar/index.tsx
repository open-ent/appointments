import { FC, useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useTranslation } from "react-i18next";

import { isToday } from "~/core/utils";
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
import { APPOINTMENTS } from "~/core/constants";

dayjs.extend(isoWeek);

export const CustomDateCalendar: FC<CustomDateCalendarProps> = ({
  acceptedAppointmentsDates,
}) => {
  const { t } = useTranslation(APPOINTMENTS);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [nbWeeksOfCurrentMonth, setNbWeeksOfCurrentMonth] = useState(0);

  useEffect(() => {
    const firstDayOfCurrentMonth = currentMonth.startOf("month");
    const lastDayOfCurrentMonth = currentMonth.endOf("month");

    const firstWeek = firstDayOfCurrentMonth.isoWeek();
    const lastWeek = lastDayOfCurrentMonth.isoWeek();

    setNbWeeksOfCurrentMonth(lastWeek - firstWeek + 1);
  }, [currentMonth]);

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
                isMonthDay={currentMonth.isSame(day, "month")}
                nbWeeksOfCurrentMonth={nbWeeksOfCurrentMonth}
              >
                {day.date()}
              </StyledDay>
            );
          },
        }}
        onMonthChange={(month) => setCurrentMonth(month)}
        onYearChange={(year) => setCurrentMonth(year)}
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
