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
  minHeight: "3.6rem",
  flexWrap: "wrap",
};

export const iconStyle = {
  color: PURPLE,
  fontSize: "2rem",
};

export const errorStyle = {
  marginLeft: "1rem",
};

export const noSlotStyle = {
  marginLeft: "1.5rem",
};
