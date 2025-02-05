import { FC, useEffect, useMemo, useRef, useState } from "react";

import { Button, EllipsisWithTooltip } from "@cgi-learning-hub/ui";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import {
  Box,
  ClickAwayListener,
  Divider,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import {
  APPOINTMENT_STATE_VALUES,
  APPOINTMENTS,
  TIME_FORMAT,
} from "~/core/constants";
import { APPOINTMENT_STATE, CONFIRM_MODAL_TYPE } from "~/core/enums";
import { useGlobal } from "~/providers/GlobalProvider";
import { useMyAppointments } from "~/providers/MyAppointmentsProvider";
import { UserPicture } from "../UserPicture";
import {
  bottomRightBoxStyle,
  bottomWrapperBoxStyle,
  CancelButtonBox,
  dateBoxStyle,
  dividerStyle,
  iconsStyle,
  pictureStyle,
  rowBoxStyle,
  StyledCard,
  twoButtonsBoxStyle,
  twoButtonsStyle,
} from "./style";
import { AppointmentCardProps } from "./types";
import { AppointmentStateIcon } from "./utils";

export const AppointmentCard: FC<AppointmentCardProps> = ({ appointment }) => {
  const { t } = useTranslation(APPOINTMENTS);
  const theme = useTheme();
  const { appointmentIdFromNotify, setAppointmentIdFromNotify } = useGlobal();

  const {
    handleAcceptAppointment,
    handleClickAppointment,
    handleOpenDialogModal,
  } = useMyAppointments();

  const isAppointmentFromNotif = useMemo(
    () => appointmentIdFromNotify === appointment.id,
    [appointmentIdFromNotify, appointment.id],
  );

  const canCancelRequest = useMemo(
    () => dayjs().add(24, "hour").isBefore(appointment.beginDate),
    [appointment.beginDate],
  );

  const appointmentCardRef = useRef<HTMLDivElement | null>(null);

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (!appointmentCardRef.current || !isAppointmentFromNotif) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimated(true);
          setTimeout(() => {
            setAppointmentIdFromNotify(null);
          }, 1000);
        }
      },
      {
        threshold: 1.0, // set to 1.0 to trigger when the element is fully visible
      },
    );

    observer.observe(appointmentCardRef.current);

    return () => {
      if (appointmentCardRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(appointmentCardRef.current);
      }
    };
  }, [isAppointmentFromNotif, setAppointmentIdFromNotify]);

  useEffect(() => {
    if (isAppointmentFromNotif && appointmentCardRef.current) {
      appointmentCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isAppointmentFromNotif]);

  // Event Handlers

  const handleCardClick = () => {
    handleClickAppointment(appointment.id);
  };

  const handleCancelRequestClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleOpenDialogModal(CONFIRM_MODAL_TYPE.CANCEL_REQUEST, appointment.id);
  };

  const handleAcceptClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleAcceptAppointment(appointment.id);
  };

  const handleRejectClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleOpenDialogModal(CONFIRM_MODAL_TYPE.REJECT_REQUEST, appointment.id);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsAnimated(false)}>
      <StyledCard
        ref={appointmentCardRef}
        theme={theme}
        isAnimated={isAnimated}
        onClick={handleCardClick}
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
            <Tooltip
              title={
                canCancelRequest
                  ? ""
                  : t("appointments.cannot.cancel.request.tooltip")
              }
              placement="bottom"
              arrow
              componentsProps={{
                tooltip: {
                  style: {
                    width: "210px",
                  },
                },
              }}
            >
              <CancelButtonBox
                onClick={(event) => event.stopPropagation()}
                canCancelRequest={canCancelRequest}
              >
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  disabled={!canCancelRequest}
                  onClick={handleCancelRequestClick}
                >
                  {t("appointments.cancel.request")}
                </Button>
              </CancelButtonBox>
            </Tooltip>
          ) : (
            <Box sx={twoButtonsBoxStyle}>
              <Button
                variant="outlined"
                sx={twoButtonsStyle}
                color="success"
                onClick={handleAcceptClick}
              >
                {t("appointments.accept")}
              </Button>
              <Button
                variant="outlined"
                sx={twoButtonsStyle}
                color="error"
                onClick={handleRejectClick}
              >
                {t("appointments.refuse")}
              </Button>
            </Box>
          ))}
      </StyledCard>
    </ClickAwayListener>
  );
};
