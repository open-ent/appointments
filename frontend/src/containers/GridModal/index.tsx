import { FC } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Button } from "@cgi-learning-hub/ui";
import { CustomStepper } from "~/components/CustomStepper";
import { DialogModal } from "~/components/DialogModal";
import { GRID_MODAL_VALUES } from "~/core/constants";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { FirstPageGridModal } from "../FirstPageGridModal";
import { SecondPageGridModal } from "../SecondPageGridModal";
import {
  bottomButtonBoxStyle,
  closeIconStyle,
  contentBoxStyle,
  instructionStyle,
  modalBoxStyle,
} from "./style";

export const GridModal: FC = () => {
  const { t } = useTranslation("appointments");

  const {
    isDisplayFirstPage,
    isDisplaySecondPage,
    handlePrev,
    handleNext,
    handleSubmit,
    isModalOpen,
    isDialogOpen,
    handleCancel,
    handleConfirmDialog,
    handleCancelDialog,
    page,
    modalType,
    confirmModalType,
  } = useGridModal();

  const handleClose = () => {
    if (modalType === GRID_MODAL_TYPE.CONSULTATION) handleCancel();
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={modalBoxStyle}>
          <Box sx={contentBoxStyle}>
            <Box sx={spaceBetweenBoxStyle}>
              <Typography variant="h3">
                {t(GRID_MODAL_VALUES[modalType].titleKey)}
              </Typography>
              <IconButton sx={closeIconStyle} onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </Box>
            {GRID_MODAL_VALUES[modalType].instructionKey && (
              <Typography sx={instructionStyle}>
                {t(GRID_MODAL_VALUES[modalType].instructionKey)}
              </Typography>
            )}
            {isDisplayFirstPage && <FirstPageGridModal />}
            {isDisplaySecondPage && <SecondPageGridModal />}
            {modalType === GRID_MODAL_TYPE.CREATION && (
              <CustomStepper
                page={page}
                handleCancel={handleCancel}
                handlePrev={handlePrev}
                handleNext={handleNext}
                handleSubmit={handleSubmit}
              />
            )}
            {modalType === GRID_MODAL_TYPE.EDIT && (
              <Box sx={bottomButtonBoxStyle}>
                <Button onClick={handleCancel} variant="text">
                  {t("appointments.cancel")}
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                  {t("appointments.save")}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
      <DialogModal
        open={isDialogOpen}
        type={confirmModalType}
        handleCancel={handleCancelDialog}
        handleConfirm={handleConfirmDialog}
      />
    </>
  );
};
