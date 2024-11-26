import { Box, styled, SxProps } from "@mui/material";

import { RowSlotsWrapperProps } from "./types";
import { columnBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";
import { BLACK } from "~/styles/color.constants";
import { BOLD_FONT, ITALIC_FONT } from "~/styles/fontStyle.constants";

export const weekSlotsWrapperStyle: SxProps = {
  ...columnBoxStyle,
  justifyContent: "space-around",
  gap: "1.6rem",
  alignItems: "flex-start",
  height: "100%",
};

export const RowSlotsWrapper = styled(Box)<RowSlotsWrapperProps>(
  ({ isEmpty }) => ({
    opacity: isEmpty ? "0.5" : "1",
    ...flexStartBoxStyle,
    gap: "2rem",
    alignItems: "flex-start",
    height: "fit-content",
  }),
);

export const daySlotsHeaderStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  lineHeight: "0",
  minWidth: "8rem",
  marginTop: ".4rem",
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
  height: "100%",
};
