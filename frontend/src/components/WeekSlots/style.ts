import { columnBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";
import { PURPLE } from "~/styles/color.constants";

export const dayBoxStyle = {
  ...flexStartBoxStyle,
};

export const weekBoxStyle = {
  ...columnBoxStyle,
  gap: "1rem",
};

export const dayLabelStyle = {
  minWidth: "8rem",
  height: "100%",
};

export const slotsBoxStyle = {
  ...flexStartBoxStyle,
  flexWrap: "wrap",
};

export const iconStyle = {
  color: PURPLE,
  fontSize: "2rem",
};

export const errorStyle = {
  marginLeft: "1rem",
};
