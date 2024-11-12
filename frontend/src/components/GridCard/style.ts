import { Box, styled, SxProps } from "@mui/material";

import { ColorDotProps, StateDotProps } from "./types";
import { getGridStateColor } from "./utils";
import { flexStartBoxStyle } from "~/styles/boxStyles";
import { GREEN } from "~/styles/color.constants";

export const ColorDot = styled(Box)<ColorDotProps>(({ color }) => ({
  backgroundColor: color,
  borderRadius: "50%",
  minHeight: "4rem",
  minWidth: "4rem",
  maxHeight: "4rem",
  maxWidth: "4rem",
}));

export const firstLineBoxStyle: SxProps = {
  display: "flex",
  gap: "0.6rem",
  alignItems: "center",
};

export const nameTextStyle: SxProps = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap",
};

export const secondLineBoxStyle: SxProps = {
  ...flexStartBoxStyle,
  flexDirection: "row",
  gap: "3rem",
  alignItems: "flex-start",
  "@media (max-width: 720px)": {
    flexDirection: "column",
    gap: "0",
  },
};

export const stateStyle: SxProps = {
  display: "flex",
  gap: "0.4rem",
  alignItems: "center",
};

export const structureIconStyle: SxProps = {
  color: GREEN,
  height: "2rem",
  width: "2rem",
};

export const StateDot = styled(Box)<StateDotProps>(({ state }) => ({
  backgroundColor: getGridStateColor(state),
  borderRadius: "50%",
  height: "1rem",
  width: "1rem",
}));

export const cardWrapperStyle: SxProps = {
  display: "flex",
  justifyContent: "space-between",
  borderRadius: "0.5rem",
  boxShadow: "0px 0px 6px 0px #0000001F",
  padding: "1.2rem",
  width: "100%",
  gap: "1.6rem",
};

export const leftBoxStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: "1.6rem",
  minWidth: 0,
  flex: "1 1 auto",
};

export const leftTextWrapperStyle: SxProps = {
  maxWidth: "calc(100% - 4rem)",
};

export const buttonsBoxStyle: SxProps = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
  flex: "0 0 auto",
  marginLeft: "1.6rem",
};

export const moreButtonBoxStyle: SxProps = {
  height: "100%",
};

export const moreButtonStyle: SxProps = {
  "& > .MuiSvgIcon-root": {
    fontSize: "2.4rem",
  },
};
