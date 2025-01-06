import { FC } from "react";

import { Button } from "@cgi-learning-hub/ui";
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
import { APPOINTMENT_STATE_VALUES } from "~/core/constants";
import { APPOINTMENT_STATE } from "~/core/enums";

export const AppointmentCard: FC<AppointmentCardProps> = ({ appointment }) => {
  const { t } = useTranslation("appointments");

  return (
    <Box sx={cardWrapperStyle}>
      <Box
        component="img"
        src={appointment.picture}
        alt={appointment.displayName}
        sx={pictureStyle}
      />
      <Typography variant="h5" fontWeight={"bold"}>
        {appointment.displayName}
      </Typography>
      <Typography variant="body1">
        {appointment.functions.join(", ")}
      </Typography>
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
              {appointment.beginDate.format("HH:mm")} -{" "}
              {appointment.endDate.format("HH:mm")}
            </Typography>
          </Box>
          <Box sx={rowBoxStyle}>
            <AppointmentStateIcon
              state={appointment.state}
              isRequester={true}
            />
            <Typography variant="body1">
              {t(APPOINTMENT_STATE_VALUES[appointment.state].i18nKey)}
            </Typography>
          </Box>
          {appointment.videoCallLink && (
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
          <Button variant="outlined" color="error" fullWidth>
            {t("appointments.cancel.request")}
          </Button>
        ) : (
          <Box sx={twoButtonsBoxStyle}>
            <Button variant="outlined" sx={twoButtonsStyle} color="success">
              {t("appointments.accept")}
            </Button>
            <Button variant="outlined" sx={twoButtonsStyle} color="error">
              {t("appointments.refuse")}
            </Button>
          </Box>
        ))}
    </Box>
  );
};
