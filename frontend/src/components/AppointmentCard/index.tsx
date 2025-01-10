import { FC } from "react";

import { Button, EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import { Box, Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  bottomRightBoxStyle,
  bottomWrapperBoxStyle,
  cardWrapperStyle,
  dateBoxStyle,
  dividerStyle,
  iconsStyle,
  pictureStyle,
  rowBoxStyle,
  twoButtonsBoxStyle,
  twoButtonsStyle,
} from "./style";
import { AppointmentCardProps } from "./types";
import { AppointmentStateIcon } from "./utils";
import { UserPicture } from "../UserPicture";
import { APPOINTMENT_STATE_VALUES, TIME_FORMAT } from "~/core/constants";
import { APPOINTMENT_STATE } from "~/core/enums";
import { useMyAppointments } from "~/providers/MyAppointmentsProvider";

export const AppointmentCard: FC<AppointmentCardProps> = ({ appointment }) => {
  const { t } = useTranslation("appointments");

  const {
    handleAcceptAppointment,
    handleCancelAppointment,
    handleRejectAppointment,
    handleClickAppointment,
  } = useMyAppointments();

  return (
    <Box
      sx={cardWrapperStyle}
      onClick={() => handleClickAppointment(appointment.id)}
    >
      <Box sx={pictureStyle}>
        <UserPicture picture={appointment.picture} />
      </Box>
      <EllipsisWithTooltip
        typographyProps={{ variant: "h5", fontWeight: "bold" }}
      >
        {appointment.displayName}
      </EllipsisWithTooltip>
      <EllipsisWithTooltip typographyProps={{ variant: "body1" }}>
        {appointment.functions.join(", ")}
      </EllipsisWithTooltip>
      <Box sx={bottomWrapperBoxStyle}>
        <Box sx={dateBoxStyle}>
          <Typography fontSize={"3.6rem"} lineHeight={"1.2"}>
            {appointment.beginDate.format("D")}
          </Typography>
          <Typography variant="body1">
            {appointment.beginDate.locale("fr").format("MMM")}
          </Typography>
        </Box>
        <Divider
          sx={dividerStyle}
          orientation="vertical"
          variant="middle"
          flexItem
        />
        <Box sx={bottomRightBoxStyle}>
          <Box sx={rowBoxStyle}>
            <AccessTimeFilledIcon sx={iconsStyle} />
            <Typography variant="body1">
              {appointment.beginDate.format(TIME_FORMAT)} -{" "}
              {appointment.endDate.format(TIME_FORMAT)}
            </Typography>
          </Box>
          <Box sx={rowBoxStyle}>
            <AppointmentStateIcon
              state={appointment.state}
              isRequester={appointment.isRequester}
            />
            <Typography variant="body1">
              {t(APPOINTMENT_STATE_VALUES[appointment.state].i18nKey)}
            </Typography>
          </Box>
          {appointment.isVideoCall && appointment.videoCallLink && (
            <Box sx={rowBoxStyle}>
              <VideoCameraFrontIcon sx={iconsStyle} color="primary" />
              <Typography variant="body1">
                {t("appointments.videoconference")}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      {appointment.state === APPOINTMENT_STATE.CREATED &&
        (appointment.isRequester ? (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => handleCancelAppointment(appointment.id)}
          >
            {t("appointments.cancel.request")}
          </Button>
        ) : (
          <Box sx={twoButtonsBoxStyle}>
            <Button
              variant="outlined"
              sx={twoButtonsStyle}
              color="success"
              onClick={() => handleAcceptAppointment(appointment.id)}
            >
              {t("appointments.accept")}
            </Button>
            <Button
              variant="outlined"
              sx={twoButtonsStyle}
              color="error"
              onClick={() => handleRejectAppointment(appointment.id)}
            >
              {t("appointments.refuse")}
            </Button>
          </Box>
        ))}
    </Box>
  );
};
