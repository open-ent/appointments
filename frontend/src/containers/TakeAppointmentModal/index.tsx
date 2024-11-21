import { FC } from "react";

import { Box, Modal } from "@mui/material";

import { contentBoxStyle, modalBoxStyle } from "./style";
import { TakeAppointmentModalProps } from "./types";
import { TakeAppointmentGridInfos } from "../TakeAppointmentGridInfos";
import { SLOT_DURATION } from "~/core/enums";
import { useFindAppointmentsProvider } from "~/providers/FindAppointmentsProvider";

export const TakeAppointmentModal: FC<TakeAppointmentModalProps> = ({
  userInfos,
}) => {
  const { isModalOpen, setIsModalOpen } = useFindAppointmentsProvider();

  const gridsName = ["grid1", "grid2", "grid3"];
  const gridInfo = {
    visio: true,
    slotDuration: SLOT_DURATION.FIFTEEN_MINUTES,
    location: "Paris",
    publicComment: "Public comment",
  };
  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      disableAutoFocus
    >
      <Box sx={modalBoxStyle}>
        <Box sx={contentBoxStyle}>
          <TakeAppointmentGridInfos
            userInfos={userInfos}
            gridsName={gridsName}
            gridInfo={gridInfo}
          />
        </Box>
      </Box>
    </Modal>
  );
};
