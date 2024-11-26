import { Box, styled, SxProps } from "@mui/material";

import { ColumnSlotsWrapperProps } from "./types";
import { columnBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";
import { BLACK } from "~/styles/color.constants";
import { BOLD_FONT, ITALIC_FONT } from "~/styles/fontStyle.constants";

export const weekSlotsWrapperStyle: SxProps = {
  ...flexStartBoxStyle,
  justifyContent: "space-around",
  flex: "0 1 100%",
  gap: "1.6rem",
  alignItems: "flex-start",
  overflowY: "scroll",
  marginRight: "-0.6rem",
  "&::-webkit-scrollbar": {
    width: "0.6rem",
    height: "0.8rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "divider",
    borderRadius: "0.3rem",
  },
};

export const ColumnSlotsWrapper = styled(Box)<ColumnSlotsWrapperProps>(
  ({ isEmpty }) => ({
    opacity: isEmpty ? "0.5" : "1",
  }),
);

export const daySlotsWrapperStyle: SxProps = {
  ...columnBoxStyle,
  gap: ".8rem",
};

export const headerStyle: SxProps = {
  ...flexStartBoxStyle,
  justifyContent: "space-around",
};

export const daySlotsHeaderStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  lineHeight: "0",
};

export const weekDayStyle: SxProps = {
  ...BOLD_FONT,
  fontSize: "1.3rem",
  lineHeight: "1.2rem",
  color: BLACK,
};

export const dayStyle: SxProps = {
  ...ITALIC_FONT,
  fontSize: "1.3rem",
  color: BLACK,
};

export const visioOptionStyle: SxProps = {
  color: BLACK,
  fontSize: "1.4rem",
};

export const containerStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignSelf: "stretch",
  justifyContent: "space-between",
};
