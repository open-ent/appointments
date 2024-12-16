import { FC } from "react";

import { Button, IconButton } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import {
  Alert,
  AlertColor,
  Box,
  Divider,
  Modal,
  Snackbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  closeIconStyle,
  contentBoxStyle,
  ContentWrapper,
  dividerStyle,
  ModalContainer,
  submitButtonStyle,
} from "./style";
import { BookAppointmentModalProps } from "./types";
import { BookAppointmentGridInfos } from "../BookAppointmentGridInfos";
import { BookAppointmentWeekSlotsDesktop } from "../BookAppointmentWeekSlotsDesktop";
import { BookAppointmentWeekSlotsMobile } from "../BookAppointmentWeekSlotsMobile";
import { BOOK_APPOINTMENT_MODAL_BREAKPOINT } from "~/core/breakpoints";
import { ALERT_VALUES } from "~/core/constants";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const BookAppointmentModal: FC<BookAppointmentModalProps> = ({
  userInfos,
}) => {
  const {
    isModalOpen,
    setIsModalOpen,
    selectedSlotId,
    handleSubmitAppointment,
    alert,
    handleCloseAlert,
  } = useBookAppointmentModal();
  const { t } = useTranslation("appointments");
  const isMobile = useMediaQuery(
    `(max-width: ${BOOK_APPOINTMENT_MODAL_BREAKPOINT}px)`,
  );

  return (
    <>
      <Snackbar
        open={alert.isOpen}
        autoHideDuration={7000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={ALERT_VALUES[alert.alert].severity as AlertColor}
          sx={{ width: "100%" }}
        >
          {t(ALERT_VALUES[alert.alert].i18nKey)}
        </Alert>
      </Snackbar>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        disableAutoFocus
      >
        <ModalContainer isMobile={isMobile}>
          <Box sx={contentBoxStyle}>
            <Box sx={spaceBetweenBoxStyle}>
              <Typography variant="h3">
                {t("appointments.book.appointment.modal.title")}
              </Typography>
              <IconButton
                sx={closeIconStyle}
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <ContentWrapper isMobile={isMobile}>
              <BookAppointmentGridInfos userInfos={userInfos} />
              {isMobile ? (
                <BookAppointmentWeekSlotsMobile />
              ) : (
                <>
                  <Divider sx={dividerStyle} orientation="vertical" flexItem />
                  <BookAppointmentWeekSlotsDesktop />
                </>
              )}
            </ContentWrapper>
            <Box sx={submitButtonStyle}>
              <Button
                disabled={!selectedSlotId}
                variant="contained"
                onClick={handleSubmitAppointment}
                startIcon={<EventAvailableIcon />}
              >
                {t("appointments.book.appointment.modal.submit")}
              </Button>
            </Box>
          </Box>
        </ModalContainer>
      </Modal>
    </>
  );
};
