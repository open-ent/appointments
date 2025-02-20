import { FC } from "react";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
} from "@cgi-learning-hub/ui";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useTranslation } from "react-i18next";

import { BOOK_APPOINTMENT_MODAL_BREAKPOINT } from "~/core/breakpoints";
import { APPOINTMENTS } from "~/core/constants";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { BookAppointmentGridInfos } from "../BookAppointmentGridInfos";
import { BookAppointmentWeekSlotsDesktop } from "../BookAppointmentWeekSlotsDesktop";
import { BookAppointmentWeekSlotsMobile } from "../BookAppointmentWeekSlotsMobile";
import {
  closeIconStyle,
  contentBoxStyle,
  ContentWrapper,
  dividerStyle,
  ModalContainer,
  submitButtonStyle,
} from "./style";
import { BookAppointmentModalProps } from "./types";

export const BookAppointmentModal: FC<BookAppointmentModalProps> = ({
  userInfos,
}) => {
  const {
    isModalOpen,
    selectedSlotId,
    handleSubmitAppointment,
    handleCloseModal,
  } = useBookAppointmentModal();
  const { t } = useTranslation(APPOINTMENTS);
  const isMobile = useMediaQuery(
    `(max-width: ${BOOK_APPOINTMENT_MODAL_BREAKPOINT}px)`,
  );

  return (
    <Modal open={isModalOpen} onClose={handleCloseModal} disableAutoFocus>
      <ModalContainer isMobile={isMobile}>
        <Box sx={contentBoxStyle}>
          <Box sx={spaceBetweenBoxStyle}>
            <Typography variant="h2" fontWeight="bold" color="text.primary">
              {t("appointments.book.appointment.modal.title")}
            </Typography>
            <IconButton sx={closeIconStyle} onClick={handleCloseModal}>
              <CloseRoundedIcon />
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
  );
};
