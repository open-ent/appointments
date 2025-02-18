import { FC, useMemo } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  EllipsisWithTooltip,
  Link,
  Tooltip,
  Typography,
} from "@cgi-learning-hub/ui";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CommentIcon from "@mui/icons-material/Comment";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { AppointmentStateIcon } from "~/components/AppointmentCard/utils";
import { UserPicture } from "~/components/UserPicture";
import {
  APPOINTMENT_STATE_VALUES,
  APPOINTMENTS,
  TEXT_DATE_FORMAT,
  TIME_FORMAT,
} from "~/core/constants";
import { APPOINTMENT_STATE, CONFIRM_MODAL_TYPE } from "~/core/enums";
import { useGlobal } from "~/providers/GlobalProvider";
import { useMyAppointments } from "~/providers/MyAppointmentsProvider";
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

export const AppointmentInfosModal: FC<AppointmentInfosModalProps> = ({
  appointment,
}) => {
  const { minHoursBeforeCancellation } = useGlobal();
  const {
    handleCloseAppointmentModal,
    handleAcceptAppointment,
    handleOpenDialogModal,
  } = useMyAppointments();
  const { t } = useTranslation(APPOINTMENTS);

  const canCancelRequest = useMemo(
    () =>
      dayjs()
        .add(minHoursBeforeCancellation, "hour")
        .isBefore(appointment.beginDate),
    [appointment.beginDate, minHoursBeforeCancellation],
  );

  return (
    <Dialog open onClose={handleCloseAppointmentModal}>
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
                  date: appointment.beginDate.format(TEXT_DATE_FORMAT),
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
            {!!(appointment.documents && appointment.documents.length) && (
              <Box sx={rowInfoStyle}>
                <AttachFileIcon sx={greyIconStyle} />
                <Box>
                  {appointment.documents.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/workspace/document/${doc.id}`}
                      underline="hover"
                      target="_blank"
                    >
                      <Typography variant="h5">{doc.name}</Typography>
                    </Link>
                  ))}
                </Box>
              </Box>
            )}
            {appointment.publicComment && (
              <Box sx={rowInfoStyle}>
                <CommentIcon sx={greyIconStyle} />
                <Typography variant="h5" whiteSpace={"pre-line"}>
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
            <Tooltip
              title={
                canCancelRequest
                  ? ""
                  : t("appointments.cannot.cancel.request.tooltip", {
                      hours: minHoursBeforeCancellation,
                    })
              }
              placement="top"
              arrow
              componentsProps={{
                tooltip: {
                  style: {
                    width: "210px",
                  },
                },
              }}
            >
              <Box sx={oneButtonBoxStyle}>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={!canCancelRequest}
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
            </Tooltip>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
