import { flexStartBoxStyle } from "~/styles/boxStyles";

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
  color: "text.secondary",
};

export const nextButtonStyle = {
  ...stepperButtonStyle,
  color: "primary",
};

export const saveButtonStyle = {
  ...stepperButtonStyle,
};
