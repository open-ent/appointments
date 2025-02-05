import { SxProps } from "@mui/material";

import { flexStartBoxStyle } from "~/styles/boxStyles";
import { PURPLE } from "~/styles/color.constants";

export const boxStyle: SxProps = {
  ...flexStartBoxStyle,
  alignItems: "flex-start",
  gap: "1rem",
};

export const datePickerStyle: SxProps = {
  width: "17rem",
  "& .MuiSvgIcon-root": {
    color: PURPLE,
    fontSize: "2rem",
  },
  "& .MuiIconButton-root": {
    "&.Mui-disabled": {
      opacity: 0.5,
    },
  },
};

export const removeIconStyle: SxProps = {
  height: "100%",
  paddingTop: "1.5rem",
};
