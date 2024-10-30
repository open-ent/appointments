import { SxProps } from "@mui/material";

import { flexStartBoxStyle } from "~/styles/boxStyles";
import { PURPLE } from "~/styles/constants";

export const boxStyle = {
  ...flexStartBoxStyle,
  gap: "1rem",
};

export const datePickerStyle: SxProps = {
  width: "16rem",
  "& .MuiSvgIcon-root": {
    color: PURPLE,
    fontSize: "2rem",
  },
};
