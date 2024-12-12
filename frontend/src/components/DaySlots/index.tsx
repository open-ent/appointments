import { FC } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Skeleton } from "@mui/material";

import {
  noSlotsStyle,
  skeletonStyle,
  TimeSlot,
  TimeSlotWrapper,
} from "./style";
import { DaySlotsProps } from "./types";
import { sortSlots } from "./utils";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";

export const DaySlots: FC<DaySlotsProps> = ({ slots, isMobile }) => {
  const { handleOnClickSlot, selectedSlotId, isGridTimeSlotsFetching } =
    useTakeAppointmentModal();

  const sortedSlots = slots ? sortSlots(slots) : [];

  const nbOfSkeletons = 5;
  const arrayForSkeletons = Array.from({ length: nbOfSkeletons });

  return (
    <TimeSlotWrapper isMobile={isMobile}>
      {!isGridTimeSlotsFetching ? (
        sortedSlots.length ? (
          sortedSlots.map((slot) => (
            <TimeSlot
              onClick={() => handleOnClickSlot(slot.id)}
              selected={slot.id === selectedSlotId}
              variant="text"
              key={slot.id}
            >
              {slot.begin.parseToString()}
            </TimeSlot>
          ))
        ) : (
          <Box sx={noSlotsStyle}>
            <CloseIcon />
          </Box>
        )
      ) : (
        arrayForSkeletons.map((_, index) => (
          <Skeleton key={index} variant="rectangular" sx={skeletonStyle} />
        ))
      )}
    </TimeSlotWrapper>
  );
};
