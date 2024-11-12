import { SxProps } from "@mui/material";

import { flexStartBoxStyle } from "~/styles/boxStyles";
import { LIGHT_GREY, PURPLE } from "~/styles/color.constants";

export const stepperStyle: SxProps = {
  ...flexStartBoxStyle,
  justifyContent: "space-around",
};

const stepperButtonStyle: SxProps = {
  minWidth: "fit-content",
  width: "25%",
};

export const backButtonStyle: SxProps = {
  ...stepperButtonStyle,
  color: LIGHT_GREY,
};

export const nextButtonStyle: SxProps = {
  ...stepperButtonStyle,
  color: PURPLE,
};

export const saveButtonStyle: SxProps = {
  ...stepperButtonStyle,
};
