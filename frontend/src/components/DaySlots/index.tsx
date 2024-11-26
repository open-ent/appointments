import { FC } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";

import { noSlotsStyle, TimeSlot, TimeSlotWrapper } from "./style";
import { DaySlotsProps } from "./types";
import { formatTimeToString } from "~/core/utils/date.utils";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";

export const DaySlots: FC<DaySlotsProps> = ({ slots, modalSize }) => {
  const { handleOnClickSlot, selectedSlotId } = useTakeAppointmentModal();

  return (
    <TimeSlotWrapper modalSize={modalSize}>
      {slots.length ? (
        slots.map((slot) => (
          <TimeSlot
            onClick={() => handleOnClickSlot(slot.id)}
            selected={slot.id === selectedSlotId}
            variant="text"
            key={slot.id}
          >
            {formatTimeToString(slot.begin)}
          </TimeSlot>
        ))
      ) : (
        <Box sx={noSlotsStyle}>
          <CloseIcon />
        </Box>
      )}
    </TimeSlotWrapper>
  );
};
