import { Box, styled, SxProps } from "@mui/material";

import { GridListTitleProps } from "./types";
import { columnBoxStyle } from "~/styles/boxStyles";
import { ITALIC_FONT } from "~/styles/fontStyle.constants";

export const gridListStyle: SxProps = {
  ...columnBoxStyle,
  gap: "1rem",
};

export const paginationStyle: SxProps = {
  display: "flex",
  justifyContent: "center",
};

export const emptyStateStyle: SxProps = {
  ...ITALIC_FONT,
};

export const GridListTitle = styled(Box)<GridListTitleProps>(
  ({ isExpandable }) => ({
    cursor: isExpandable ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    width: "fit-content",
    gap: "1rem",
  }),
);

export const GridListContentStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};
