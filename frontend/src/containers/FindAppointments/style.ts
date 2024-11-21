import { SxProps } from "@mui/material";

import { columnBoxStyle } from "~/styles/boxStyles";

export const containerStyle = {
  ...columnBoxStyle,
  padding: "3rem 3rem",
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
