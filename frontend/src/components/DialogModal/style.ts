import { SxProps } from "@mui/material";

import { GREY } from "~/styles/color.constants";

export const modalBoxStyle: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc( min(50rem, 90%))",
  maxHeight: "fit-content",
  background: "white",
  borderRadius: ".5rem",
  padding: "2rem 4rem",
  gap: "2rem",
};

export const contentBoxStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
};

export const buttonsBoxStyle: SxProps = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "2rem",
};

export const buttonStyle: SxProps = {
  padding: "1rem 2rem",
};

export const cancelButtonStyle: SxProps = {
  ...buttonStyle,
  color: GREY,
};
