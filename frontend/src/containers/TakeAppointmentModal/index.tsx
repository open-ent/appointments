import { FC, useEffect, useState } from "react";

import { Button, IconButton } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Box, Divider, Modal, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { MODAL_SIZE } from "./enum";
import {
  closeIconStyle,
  contentBoxStyle,
  ContentWrapper,
  dividerStyle,
  modalBoxStyle,
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
  const [modalSize, setModalSize] = useState<MODAL_SIZE>(MODAL_SIZE.LARGE);

  useEffect(() => {
    const handleResize = () => {
      setModalSize(
        window.innerWidth <= TAKE_APPOINTMENT_MODAL_BREAKPOINT
          ? MODAL_SIZE.SMALL
          : MODAL_SIZE.LARGE,
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      disableAutoFocus
    >
      <Box sx={modalBoxStyle}>
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
          <ContentWrapper modalSize={modalSize}>
            <TakeAppointmentGridInfos userInfos={userInfos} />
            {modalSize === MODAL_SIZE.SMALL ? (
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
      </Box>
    </Modal>
  );
};
