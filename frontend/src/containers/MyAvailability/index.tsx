import { FC, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { availabilityContainerStyle } from "./style";
import { GridModal } from "../GridModal";
import { GRID_MODAL_TYPE } from "../GridModal/enum";
import { useGlobalProvider } from "~/providers/GlobalProvider";
import { MODAL_TYPE } from "~/providers/GlobalProvider/enum";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const MyAvailability: FC = () => {
  const { t } = useTranslation("appointments");
  const {
    displayModals: { grid },
    handleDisplayModal,
  } = useGlobalProvider();

  const [gridModalType] = useState<GRID_MODAL_TYPE>(GRID_MODAL_TYPE.CREATION);

  return (
    <Box sx={availabilityContainerStyle}>
      <Box sx={spaceBetweenBoxStyle}>
        <Typography variant="h2">
          {t("appointments.my.availability")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => handleDisplayModal(MODAL_TYPE.GRID)}
        >
          {t("appointments.create.grid")}
        </Button>
        <GridModal
          isOpen={grid}
          handleClose={() => handleDisplayModal(MODAL_TYPE.GRID)}
          gridModalType={gridModalType}
        />
      </Box>
    </Box>
  );
};
