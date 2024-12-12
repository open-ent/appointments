import { Button, common } from "@cgi-learning-hub/ui";
import { Box, styled, SxProps } from "@mui/material";

import { TimeSlotProps, TimeSlotWrapperProps } from "./types";
import { BLACK, LIGHTER_PURPLE, PURPLE } from "~/styles/color.constants";
import { IMPORTANT } from "~/styles/fontStyle.constants";

export const TimeSlot = styled(Button)<TimeSlotProps>(({ selected }) => ({
  width: "6.2rem",
  minHeight: "3.4rem",
  borderRadius: ".8rem !important",
  backgroundColor: selected ? PURPLE + IMPORTANT : LIGHTER_PURPLE + IMPORTANT,
  color: selected ? common.white + IMPORTANT : BLACK + IMPORTANT,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold" + IMPORTANT,
  fontSize: "1.3rem" + IMPORTANT,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: PURPLE + IMPORTANT,
    color: common.white + IMPORTANT,
  },
}));

export const skeletonStyle: SxProps = {
  width: "6.2rem",
  minHeight: "3.4rem",
  borderRadius: ".8rem !important",
};

export const TimeSlotWrapper = styled(Box)<TimeSlotWrapperProps>(
  ({ isMobile }) => ({
    display: "flex",
    gap: ".8rem",
    justifyContent: isMobile ? "flex-start" : "center",
    alignItems: "flex-start",
    alignContent: "flex-start",
    flexWrap: "wrap",
    filter: "blur(0)",
    minWidth: "6.2rem",
  }),
);

export const noSlotsStyle: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "6.2rem",
  height: "3.4rem",
  "& > .MuiSvgIcon-root": {
    fontSize: "1.8rem",
  },
};
