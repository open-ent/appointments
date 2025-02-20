import { SxProps } from "@cgi-learning-hub/ui";

import { flexStartBoxStyle } from "~/styles/boxStyles";

export const boxStyle: SxProps = {
  ...flexStartBoxStyle,
  alignItems: "flex-start",
  gap: "1rem",
};

export const datePickerStyle: SxProps = {
  width: "17rem",
  "& .MuiSvgIcon-root": {
    color: "primary.main",
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
