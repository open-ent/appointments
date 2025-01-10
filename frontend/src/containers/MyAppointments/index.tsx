import { FC } from "react";

import { Loader } from "@cgi-learning-hub/ui";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  customCalendarBoxStyle,
  emptyStateLeftBoxStyle,
  emptyStateSVGStyle,
  fisrtContainerStyle,
  loaderBoxStyle,
  mainContainerStyle,
} from "./style";
import { AppointmentCardList } from "../AppointmentCardList";
import { AppointmentInfosModal } from "../AppointmentInfosModal";
import { CustomDateCalendar } from "~/components/CustomDateCalendar";
import { AppointmentsEmptyState } from "~/components/SVG/AppointmentsEmptyState";
import { useMyAppointments } from "~/providers/MyAppointmentsProvider";
import { MY_APPOINTMENTS_LIST_STATE } from "~/providers/MyAppointmentsProvider/enum";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const MyAppointments: FC = () => {
  const { myAppointments, myAppointmentsDates, selectedAppointment } =
    useMyAppointments();
  const isMobile = useMediaQuery("(max-width:620px)");
  const { t } = useTranslation("appointments");
  const theme = useTheme();

  const myPendingAppointments =
    myAppointments[MY_APPOINTMENTS_LIST_STATE.PENDING];
  const myAcceptedAppointments =
    myAppointments[MY_APPOINTMENTS_LIST_STATE.ACCEPTED];
  const myRejectedOrCanceledAppointments =
    myAppointments[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED];

  const isLoading =
    !myPendingAppointments ||
    !myAcceptedAppointments ||
    !myRejectedOrCanceledAppointments ||
    !myAppointmentsDates;

  const isMyPendingAppointmentsEmpty =
    myPendingAppointments && myPendingAppointments.total === 0;
  const isMyAcceptedAppointmentsEmpty =
    myAcceptedAppointments && myAcceptedAppointments.total === 0;
  const isMyRejectedOrCanceledAppointmentsEmpty =
    myRejectedOrCanceledAppointments &&
    myRejectedOrCanceledAppointments.total === 0;

  const isAllAppointmentsEmpty =
    isMyPendingAppointmentsEmpty &&
    isMyAcceptedAppointmentsEmpty &&
    isMyRejectedOrCanceledAppointmentsEmpty;

  if (isLoading) {
    return (
      <Box sx={loaderBoxStyle}>
        <Loader />
      </Box>
    );
  }

  if (isAllAppointmentsEmpty) {
    return (
      <Box sx={spaceBetweenBoxStyle}>
        <Box sx={emptyStateLeftBoxStyle}>
          <Typography variant="h3" color="primary" fontWeight="bold">
            {t("appointments.my.appointments")}
          </Typography>
          <Typography fontStyle={"italic"} variant="h5">
            {t("appointments.my.appointments.accepted.empty.state")}
          </Typography>
          <Box sx={emptyStateSVGStyle}>
            <AppointmentsEmptyState fill={theme.palette.primary.main} />
          </Box>
        </Box>
        {!isMobile && (
          <Box sx={customCalendarBoxStyle}>
            <CustomDateCalendar
              acceptedAppointmentsDates={myAppointmentsDates}
            />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <>
      {selectedAppointment && (
        <AppointmentInfosModal appointment={selectedAppointment} />
      )}
      <Box sx={mainContainerStyle}>
        <Box sx={fisrtContainerStyle}>
          <AppointmentCardList
            appointmentsType={MY_APPOINTMENTS_LIST_STATE.PENDING}
            myAppointments={myPendingAppointments}
          />
          {!isMobile && (
            <Box sx={customCalendarBoxStyle}>
              <CustomDateCalendar
                acceptedAppointmentsDates={myAppointmentsDates}
              />
            </Box>
          )}
        </Box>
        <AppointmentCardList
          appointmentsType={MY_APPOINTMENTS_LIST_STATE.ACCEPTED}
          myAppointments={myAcceptedAppointments}
        />
        {myRejectedOrCanceledAppointments.total > 0 && (
          <AppointmentCardList
            appointmentsType={MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED}
            myAppointments={myRejectedOrCanceledAppointments}
          />
        )}
      </Box>
    </>
  );
};
