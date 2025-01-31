import { FC, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CustomStepper } from "~/components/CustomStepper";
import { DialogModal } from "~/components/DialogModal";
import { TOAST_VALUES } from "~/core/constants";
import { CONFIRM_MODAL_TYPE } from "~/core/enums";
import { useGlobal } from "~/providers/GlobalProvider";
import { MODAL_TYPE } from "~/providers/GlobalProvider/enum";
import { useGridModal } from "~/providers/GridModalProvider";
import { gridInputsToGridPayload } from "~/providers/GridModalProvider/utils";
import { useCreateGridMutation } from "~/services/api/GridService";
import { CreateGridPayload } from "~/services/api/GridService/types";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { FirstPageGridModal } from "../FirstPageGridModal";
import { SecondPageGridModal } from "../SecondPageGridModal";
import { GRID_MODAL_TYPE, PAGE_TYPE } from "./enum";
import {
  closeIconStyle,
  contentBoxStyle,
  instructionStyle,
  modalBoxStyle,
} from "./style";
import { GridModalProps } from "./types";

export const GridModal: FC<GridModalProps> = ({ gridModalType }) => {
  const { t } = useTranslation("appointments");
  const [page, setPage] = useState<PAGE_TYPE>(PAGE_TYPE.FIRST);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    displayModals: { [MODAL_TYPE.GRID]: grid },
    handleDisplayModal,
  } = useGlobal();
  const [createGrid] = useCreateGridMutation();

  const {
    inputs,
    publicOptions,
    blurGridModalInputs: {
      newNameError,
      newVideoCallLinkError,
      newValidityPeriodError,
      newWeekSlotsError,
      newSlotsError,
    },
    setErrorInputs,
    resetInputs,
  } = useGridModal();

  const isDisplayFirstPage =
    gridModalType === GRID_MODAL_TYPE.EDIT || page === PAGE_TYPE.FIRST;
  const isDisplaySecondPage =
    gridModalType === GRID_MODAL_TYPE.EDIT || page === PAGE_TYPE.SECOND;

  const handleCancel = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(true);
  };

  const handlePrev = () => {
    setPage(PAGE_TYPE.FIRST);
  };

  const handleNext = () => {
    const newErrors = {
      name: newNameError,
      videoCallLink: newVideoCallLinkError,
      validityPeriod: "",
      weekSlots: "",
      slots: {
        ids: [],
        error: "",
      },
    };
    setErrorInputs(newErrors);
    if (newErrors.name || newErrors.videoCallLink) return;
    setPage(PAGE_TYPE.SECOND);
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: newNameError,
      videoCallLink: newVideoCallLinkError,
      validityPeriod: newValidityPeriodError,
      weekSlots: newWeekSlotsError,
      slots: newSlotsError,
    };
    setErrorInputs(newErrors);
    if (
      newErrors.name ||
      newErrors.videoCallLink ||
      newErrors.validityPeriod ||
      newErrors.weekSlots ||
      newErrors.slots.ids.length
    )
      return;

    const payload: CreateGridPayload = gridInputsToGridPayload(
      inputs,
      publicOptions,
    );
    try {
      await createGrid(payload).unwrap();
      toast.success(t(TOAST_VALUES.CREATE_GRID.i18nKeySuccess));
      resetInputs();
      setPage(PAGE_TYPE.FIRST);
      handleDisplayModal(MODAL_TYPE.GRID);
    } catch (error) {
      console.error(error);
      toast.error(t(TOAST_VALUES.CREATE_GRID.i18nKeyError));
    }
  };

  const handleCancelDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDialog = () => {
    setIsDialogOpen(false);
    resetInputs();
    setPage(PAGE_TYPE.FIRST);
    handleDisplayModal(MODAL_TYPE.GRID);
  };

  return (
    <>
      <Modal open={grid}>
        <Box sx={modalBoxStyle}>
          <Box sx={contentBoxStyle}>
            <Box sx={spaceBetweenBoxStyle}>
              <Typography variant="h3">
                {t("appointments.create.grid.title")}
              </Typography>
              <IconButton sx={closeIconStyle} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography sx={instructionStyle}>
              {t("appointments.grid.required")}
            </Typography>
            {isDisplayFirstPage && <FirstPageGridModal />}
            {isDisplaySecondPage && <SecondPageGridModal />}
            <CustomStepper
              page={page}
              handleCancel={handleCancel}
              handlePrev={handlePrev}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
            />
          </Box>
        </Box>
      </Modal>
      <DialogModal
        open={isDialogOpen}
        type={CONFIRM_MODAL_TYPE.CANCEL_GRID_CREATION}
        handleCancel={handleCancelDialog}
        handleConfirm={handleConfirmDialog}
      />
    </>
  );
};
