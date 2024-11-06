import { FC, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { GRID_MODAL_TYPE, PAGE_TYPE } from "./enum";
import { contentBoxStyle, modalBoxStyle } from "./style";
import { GridModalProps } from "./types";
import { FirstPageGridModal } from "../FirstPageGridModal";
import { SecondPageGridModal } from "../SecondPageGridModal";
import { CustomStepper } from "~/components/CustomStepper";
import { useGlobalProvider } from "~/providers/GlobalProvider";
import { MODAL_TYPE } from "~/providers/GlobalProvider/enum";
import { useGridModalProvider } from "~/providers/GridModalProvider";
import { GridPayload } from "~/providers/GridModalProvider/types";
import { gridInputsToGridPayload } from "~/providers/GridModalProvider/utils";
import { useCreateGridMutation } from "~/services/api/grid.service";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const GridModal: FC<GridModalProps> = ({ gridModalType }) => {
  const { t } = useTranslation("appointments");
  const [page, setPage] = useState<PAGE_TYPE>(PAGE_TYPE.FIRST);
  const {
    displayModals: { grid },
    handleDisplayModal,
  } = useGlobalProvider();
  const [createGrid] = useCreateGridMutation();

  const {
    inputs,
    publicOptions,
    blurGridModalInputs: {
      newNameError,
      newVisioLinkError,
      newValidityPeriodError,
      newWeekSlotsError,
      newSlotsError,
    },
    setErrorInputs,
    resetInputs,
  } = useGridModalProvider();

  const isDisplayFirstPage =
    gridModalType === GRID_MODAL_TYPE.EDIT || page === PAGE_TYPE.FIRST;
  const isDisplaySecondPage =
    gridModalType === GRID_MODAL_TYPE.EDIT || page === PAGE_TYPE.SECOND;

  const handleCancel = () => {
    handleDisplayModal(MODAL_TYPE.GRID);
  };

  const handlePrev = () => {
    setPage(PAGE_TYPE.FIRST);
  };

  const handleNext = () => {
    const newErrors = {
      name: newNameError,
      visioLink: newVisioLinkError,
      validityPeriod: "",
      weekSlots: "",
      slots: {
        ids: [],
        error: "",
      },
    };
    setErrorInputs(newErrors);
    if (newErrors.name || newErrors.visioLink) return;
    setPage(PAGE_TYPE.SECOND);
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: newNameError,
      visioLink: newVisioLinkError,
      validityPeriod: newValidityPeriodError,
      weekSlots: newWeekSlotsError,
      slots: newSlotsError,
    };
    setErrorInputs(newErrors);
    if (
      newErrors.name ||
      newErrors.visioLink ||
      newErrors.validityPeriod ||
      newErrors.weekSlots ||
      newErrors.slots.ids.length
    )
      return;

    const payload: GridPayload = gridInputsToGridPayload(inputs, publicOptions);
    try {
      await createGrid(payload);
    } catch (error) {
      console.error(error);
    }
    resetInputs();
    setPage(PAGE_TYPE.FIRST);
    handleDisplayModal(MODAL_TYPE.GRID);
  };

  return (
    <Modal open={grid}>
      <Box sx={modalBoxStyle}>
        <Box sx={contentBoxStyle}>
          <Box sx={spaceBetweenBoxStyle}>
            <Typography variant="h3">
              {t("appointments.create.grid.title")}
            </Typography>
            <IconButton onClick={() => handleDisplayModal(MODAL_TYPE.GRID)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography sx={{ fontStyle: "italic" }}>
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
  );
};
