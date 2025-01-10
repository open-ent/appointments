import { SxProps } from "@mui/material";

import { centerBoxStyle, columnBoxStyle } from "~/styles/boxStyles";
import { ITALIC_FONT } from "~/styles/fontStyle.constants";

export const containerStyle = {
  ...columnBoxStyle,
  gap: "2rem",
};

export const searchInputStyle = {
  fontSize: "1.6rem",
};

export const listCardStyle: SxProps = {
  display: "grid",
  justifyItems: "center",
  gridTemplateColumns: "repeat(auto-fill, minmax(25rem, 1fr))",
  flexWrap: "wrap",
  gap: "2.4rem 3.2rem",
};

export const emptyStateBoxStyle: SxProps = {
  ...centerBoxStyle,
  ...columnBoxStyle,
  height: "fit-content",
  gap: "3rem",
  marginTop: "5rem",
};

export const emptyStateSVGStyle: SxProps = {
  width: "27rem",
  aspectRatio: "27/30",
};

export const emptyStateTextStyle: SxProps = {
  ...ITALIC_FONT,
  textAlign: "center",
  color: "text.secondary",
};
