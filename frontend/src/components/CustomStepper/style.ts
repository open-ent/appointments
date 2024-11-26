import { flexStartBoxStyle } from "~/styles/boxStyles";
import { LIGHT_GREY, PURPLE } from "~/styles/color.constants";

export const stepperStyle = {
  ...flexStartBoxStyle,
  justifyContent: "space-around",
};

const stepperButtonStyle = {
  minWidth: "fit-content",
  width: "25%",
};

export const backButtonStyle = {
  ...stepperButtonStyle,
  color: LIGHT_GREY,
};

export const nextButtonStyle = {
  ...stepperButtonStyle,
  color: PURPLE,
};

export const saveButtonStyle = {
  ...stepperButtonStyle,
};
