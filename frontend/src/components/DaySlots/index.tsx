import { FC } from "react";

import { Box, Skeleton } from "@cgi-learning-hub/ui";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
import {
  noSlotsStyle,
  skeletonStyle,
  TimeSlot,
  TimeSlotWrapper,
} from "./style";
import { DaySlotsProps } from "./types";
import { sortSlots } from "./utils";

export const DaySlots: FC<DaySlotsProps> = ({ slots, isMobile }) => {
  const { handleOnClickSlot, selectedSlotId, isGridTimeSlotsFetching } =
    useBookAppointmentModal();

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
            <CloseRoundedIcon />
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
