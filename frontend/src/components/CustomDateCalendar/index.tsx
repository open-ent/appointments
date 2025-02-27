import { FC, useEffect, useState } from "react";

import { Box, Typography } from "@cgi-learning-hub/ui";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS } from "~/core/constants";
import { MONTH } from "~/core/dayjs.const";
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

dayjs.extend(isoWeek);

export const CustomDateCalendar: FC<CustomDateCalendarProps> = ({
  acceptedAppointmentsDates,
}) => {
  const { t } = useTranslation(APPOINTMENTS);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [nbWeeksOfCurrentMonth, setNbWeeksOfCurrentMonth] = useState(0);

  useEffect(() => {
    const firstDayOfCurrentMonth = currentMonth.startOf(MONTH);
    const lastDayOfCurrentMonth = currentMonth.endOf(MONTH);

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
                isMonthDay={currentMonth.isSame(day, MONTH)}
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
          <Typography variant="body2">{t("appointments.today")}</Typography>
        </Box>
        <Box sx={legendRowStyle}>
          <Box sx={appointmentsLegendStyle}></Box>
          <Typography variant="body2">
            {t("appointments.appointments")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
