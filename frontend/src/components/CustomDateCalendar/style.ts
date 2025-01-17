import { Box, styled, Theme } from "@mui/material";

import { StyledDayProps } from "./types";

export const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.6rem",
  marginLeft: "4rem",
};

export const calandarStyle = (theme: Theme) => ({
  borderRadius: "1rem",
  boxShadow: "0px 2px 8px 0px rgba(176, 176, 176, 0.25)",
  width: "26rem",
  height: "27.5rem",
  "& .MuiPickersCalendarHeader-label": {
    fontSize: "1.4rem",
  },
  "& .MuiPickersDay-root": {
    fontSize: "1.4rem",
  },
  "& .MuiDayCalendar-header": {
    height: "2rem",
  },
  "& .MuiDayCalendar-weekDayLabel": {
    fontSize: "1.6rem",
    color: theme.palette.primary.main,
    fontWeight: "bold",
    width: "2.9rem",
  },
  "& .MuiPickersYear-yearButton": {
    fontSize: "1.4rem",
  },
  "& .MuiPickersYear-root": {
    maxWidth: "8rem",
  },
  "& .MuiPickersMonth-monthButton": {
    fontSize: "1.4rem",
  },
});

export const StyledDay = styled(Box)<StyledDayProps>(
  ({
    theme,
    isWithAcceptedAppointment,
    isToday,
    isMonthDay,
    nbWeeksOfCurrentMonth,
  }) => ({
    backgroundColor: isWithAcceptedAppointment
      ? theme.palette.success.light
      : "transparent",
    border: isToday ? `1px solid ${theme.palette.text.primary}` : "none",
    borderRadius: "50%",
    width: "2.5rem",
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    margin: nbWeeksOfCurrentMonth === 6 ? "0.2rem .4rem" : ".4rem",
    fontSize: "1.4rem",
    lineHeight: "0",
    opacity: isMonthDay ? 1 : 0,

    ...(isWithAcceptedAppointment && {
      "::after": {
        content: '""',
        position: "absolute",
        bottom: "-.3rem",
        width: ".8rem",
        height: ".8rem",
        backgroundColor: theme.palette.success.main,
        borderRadius: "50%",
      },
    }),
  }),
);
export const legendStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "1rem",
};

export const legendRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: ".5rem",
};

export const todayLegendStyle = (theme: Theme) => ({
  width: "2.5rem",
  height: "2.5rem",
  borderRadius: "50%",
  border: "1px solid",
  borderColor: theme.palette.text.primary,
});

export const appointmentsLegendStyle = (theme: Theme) => ({
  display: "flex",
  justifyContent: "center",
  width: "2.5rem",
  height: "2.5rem",
  borderRadius: "50%",
  backgroundColor: theme.palette.success.light,
  position: "relative",
  "::after": {
    content: '""',
    position: "absolute",
    bottom: "-.3rem",
    width: ".8rem",
    height: ".8rem",
    backgroundColor: theme.palette.success.main,
    borderRadius: "50%",
  },
});
