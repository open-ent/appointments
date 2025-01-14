import { FC } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  EllipsisWithTooltip,
  Link,
  Typography,
} from "@cgi-learning-hub/ui";
import CommentIcon from "@mui/icons-material/Comment";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import { useTranslation } from "react-i18next";

import {
  bottomContainerStyle,
  dialogContentStyle,
  greyIconStyle,
  modalStyle,
  oneButtonBoxStyle,
  oneButtonStyle,
  pictureStyle,
  rowInfoStyle,
  topContainerStyle,
  twoButtonsBoxStyle,
  twoButtonsStyle,
  userInfosBoxStyle,
} from "./style";
import { AppointmentInfosModalProps } from "./types";
import { AppointmentStateIcon } from "~/components/AppointmentCard/utils";
import { UserPicture } from "~/components/UserPicture";
import {
  APPOINTMENT_STATE_VALUES,
  TEXT_DATE_FORMAT,
  TIME_FORMAT,
} from "~/core/constants";
import { APPOINTMENT_STATE, CONFIRM_MODAL_TYPE } from "~/core/enums";
import { useMyAppointments } from "~/providers/MyAppointmentsProvider";

export const AppointmentInfosModal: FC<AppointmentInfosModalProps> = ({
  appointment,
}) => {
  const {
    isAppointmentModalOpen,
    handleCloseAppointmentModal,
    handleAcceptAppointment,
    handleOpenDialogModal,
  } = useMyAppointments();
  const { t } = useTranslation("appointments");

  return (
    <Dialog open={isAppointmentModalOpen} onClose={handleCloseAppointmentModal}>
      <Box sx={modalStyle}>
        <DialogTitle>
          {t("appointments.my.appointment.infos.modal.title")}
        </DialogTitle>
        <DialogContent sx={dialogContentStyle}>
          <Box sx={topContainerStyle}>
            <Box sx={pictureStyle}>
              <UserPicture picture={appointment.picture} />
            </Box>
            <Box sx={userInfosBoxStyle}>
              <EllipsisWithTooltip
                typographyProps={{ variant: "h3", fontWeight: "bold" }}
              >
                {appointment.displayName}
              </EllipsisWithTooltip>
              <EllipsisWithTooltip typographyProps={{ variant: "h5" }}>
                {appointment.functions?.join(", ")}
              </EllipsisWithTooltip>
            </Box>
          </Box>
          <Box sx={bottomContainerStyle}>
            <Box sx={rowInfoStyle}>
              <AppointmentStateIcon
                state={appointment.state}
                isRequester={appointment.isRequester}
              />
              <Typography variant="h5">
                {t(APPOINTMENT_STATE_VALUES[appointment.state].i18nKey)}
              </Typography>
            </Box>
            {appointment.isVideoCall && (
              <Box sx={rowInfoStyle}>
                <VideoCameraFrontIcon color="primary" />
                <Box>
                  <Typography variant="h5">
                    {t("appointments.my.appointment.infos.modal.video.call")}
                  </Typography>
                  <Link href={appointment.videoCallLink} color={"primary"}>
                    <Typography variant="h5">
                      {appointment.videoCallLink}
                    </Typography>
                  </Link>
                </Box>
              </Box>
            )}
            <Box sx={rowInfoStyle}>
              <EventIcon sx={greyIconStyle} />
              <Typography variant="h5">
                {t("appointments.my.appointment.infos.modal.date", {
                  date: appointment.beginDate
                    .locale("fr")
                    .format(TEXT_DATE_FORMAT),
                  beginTime: appointment.beginDate.format(TIME_FORMAT),
                  endTime: appointment.endDate.format(TIME_FORMAT),
                })}
              </Typography>
            </Box>
            {appointment.place && (
              <Box sx={rowInfoStyle}>
                <PlaceIcon sx={greyIconStyle} />
                <Typography variant="h5">{appointment.place}</Typography>
              </Box>
            )}
            {appointment.publicComment && (
              <Box sx={rowInfoStyle}>
                <CommentIcon sx={greyIconStyle} />
                <Typography variant="h5">
                  {appointment.publicComment}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {appointment.state === APPOINTMENT_STATE.CREATED &&
            (appointment.isRequester ? (
              <Box sx={oneButtonBoxStyle}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={oneButtonStyle}
                  onClick={() =>
                    handleOpenDialogModal(
                      CONFIRM_MODAL_TYPE.CANCEL_REQUEST,
                      appointment.id,
                    )
                  }
                >
                  {t("appointments.cancel.request")}
                </Button>
              </Box>
            ) : (
              <Box sx={twoButtonsBoxStyle}>
                <Button
                  variant="outlined"
                  sx={twoButtonsStyle}
                  color="success"
                  onClick={() => {
                    handleAcceptAppointment(appointment.id);
                    handleCloseAppointmentModal();
                  }}
                >
                  {t("appointments.accept")}
                </Button>
                <Button
                  variant="outlined"
                  sx={twoButtonsStyle}
                  color="error"
                  onClick={() =>
                    handleOpenDialogModal(
                      CONFIRM_MODAL_TYPE.REJECT_REQUEST,
                      appointment.id,
                    )
                  }
                >
                  {t("appointments.refuse")}
                </Button>
              </Box>
            ))}
          {appointment.state === APPOINTMENT_STATE.ACCEPTED && (
            <Box sx={oneButtonBoxStyle}>
              <Button
                variant="outlined"
                color="error"
                sx={oneButtonStyle}
                onClick={() =>
                  handleOpenDialogModal(
                    CONFIRM_MODAL_TYPE.CANCEL_APPOINTMENT,
                    appointment.id,
                  )
                }
              >
                {t("appointments.cancel.appointment")}
              </Button>
            </Box>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
