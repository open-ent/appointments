import { FC } from "react";

import { Button, IconButton } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Box, Divider, Modal, Typography, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  closeIconStyle,
  contentBoxStyle,
  ContentWrapper,
  dividerStyle,
  ModalContainer,
  submitButtonStyle,
} from "./style";
import { TakeAppointmentModalProps } from "./types";
import { TakeAppointmentGridInfos } from "../TakeAppointmentGridInfos";
import { TakeAppointmentWeekSlotsDesktop } from "../TakeAppointmentWeekSlotsDesktop";
import { TakeAppointmentWeekSlotsMobile } from "../TakeAppointmentWeekSlotsMobile";
import { TAKE_APPOINTMENT_MODAL_BREAKPOINT } from "~/core/breakpoints";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const TakeAppointmentModal: FC<TakeAppointmentModalProps> = ({
  userInfos,
}) => {
  const { isModalOpen, setIsModalOpen, selectedSlotId } =
    useTakeAppointmentModal();
  const { t } = useTranslation("appointments");
  const isMobile = useMediaQuery(
    `(max-width: ${TAKE_APPOINTMENT_MODAL_BREAKPOINT}px)`,
  );

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      disableAutoFocus
    >
      <ModalContainer isMobile={isMobile}>
        <Box sx={contentBoxStyle}>
          <Box sx={spaceBetweenBoxStyle}>
            <Typography variant="h3">
              {t("appointments.take.appointment.modal.title")}
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
            <TakeAppointmentGridInfos userInfos={userInfos} />
            {isMobile ? (
              <TakeAppointmentWeekSlotsMobile />
            ) : (
              <>
                <Divider sx={dividerStyle} orientation="vertical" flexItem />
                <TakeAppointmentWeekSlotsDesktop />
              </>
            )}
          </ContentWrapper>
          <Box sx={submitButtonStyle}>
            <Button
              disabled={!selectedSlotId}
              variant="contained"
              startIcon={<EventAvailableIcon />}
            >
              {t("appointments.take.appointment.modal.submit")}
            </Button>
          </Box>
        </Box>
      </ModalContainer>
    </Modal>
  );
};
