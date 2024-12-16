import { Box, styled, SxProps } from "@mui/material";

import { RowSlotsWrapperProps } from "./types";
import {
  centerBoxStyle,
  columnBoxStyle,
  flexStartBoxStyle,
} from "~/styles/boxStyles";
import { BLACK, LIGHTER_GREY } from "~/styles/color.constants";
import { BOLD_FONT, ITALIC_FONT } from "~/styles/fontStyle.constants";

export const weekSlotsWrapperStyle: SxProps = {
  ...columnBoxStyle,
  width: "fit-content",
  justifyContent: "space-around",
  gap: "1.6rem",
  alignItems: "flex-start",
  height: "100%",
};

export const RowSlotsWrapper = styled(Box)<RowSlotsWrapperProps>(
  ({ isEmpty }) => ({
    opacity: isEmpty ? "0.5" : "1",
    ...flexStartBoxStyle,
    gap: "1rem",
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

export const videoCallOptionStyle: SxProps = {
  color: BLACK,
  fontSize: "1.4rem",
};

export const containerStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  alignSelf: "stretch",
  justifyContent: "space-between",
  height: "100%",
};

export const noSlotStyle: SxProps = {
  ...centerBoxStyle,
  padding: "1rem 2rem",
  margin: "0 2rem",
  backgroundColor: LIGHTER_GREY,
  boxShadow: "0px 2px 8px 0px rgba(156, 156, 156, 0.25)",
  borderRadius: "0.5rem",
  fontStyle: "italic",
  textAlign: "center",
  height: "20rem",
};

export const nextTimeSlotStyle = {
  padding: "2rem",
  boxShadow: "0px 2px 8px 0px rgba(156, 156, 156, 0.25)",
};

export const nextTimeSlotTextStyle: SxProps = {
  ...flexStartBoxStyle,
  flexWrap: "wrap",
};
