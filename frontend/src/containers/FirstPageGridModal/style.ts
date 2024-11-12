import { Select, styled, SxProps } from "@mui/material";

import { CustomSelectProps } from "./types";
import { flexEndBoxStyle, spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const firstLineStyle: SxProps = {
  ...spaceBetweenBoxStyle,
  flexWrap: "wrap",
  columnGap: "2rem",
};

export const nameStyle: SxProps = {
  flex: "1 1 60%",
};

export const colorStyle: SxProps = {
  ...flexEndBoxStyle,
  width: "fit-content",
  gap: "1rem",
};

export const CustomSelect = styled(Select)<CustomSelectProps>(
  ({ isDisabled }) => ({
    "& .MuiSelect-icon": {
      display: isDisabled && "none",
    },
  }),
);
