import { flexStartBoxStyle } from "~/styles/boxStyles";
import { LIGHT_GREY, PURPLE } from "~/styles/constants";

export const stepperStyle = {
  ...flexStartBoxStyle,
  justifyContent: "space-around",
};

const stepperButtonStyle = {
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
