import { Box, Button, styled, SxProps } from "@cgi-learning-hub/ui";

import { TimeSlotProps, TimeSlotWrapperProps } from "./types";

export const TimeSlot = styled(Button)<TimeSlotProps>(
  ({ selected, theme }) => ({
    width: "6.2rem",
    minHeight: "3.4rem",
    borderRadius: ".8rem !important",
    backgroundColor: selected
      ? theme.palette.primary.main
      : theme.palette.primary.light,
    color: selected ? theme.palette.common.white : theme.palette.common.black,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold !important",
    fontSize: "1.3rem !important",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  }),
);

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
