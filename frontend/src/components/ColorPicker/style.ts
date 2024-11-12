import { SxProps } from "@mui/material";

export const colorPickerIconStyle: SxProps = {
  width: "4.4rem",
  height: "4.4rem",
  position: "relative",
  borderRadius: "50%",
  "&:hover, :focus, :focus-visible": {
    backgroundColor: "#F8F9F9",
    outline: "none",
  },
};

export const circlePickerStyle: SxProps = {
  position: "absolute",
  bottom: "5rem",
  right: "-2rem",
  backgroundColor: "white",
  zIndex: 1000,
  padding: "1rem",
  borderRadius: "1rem",
  display: "flex",
  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
};
