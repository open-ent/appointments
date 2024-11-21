import { SxProps } from "@mui/material";

export const modalBoxStyle: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc( min(62rem, 95%))",
  height: "calc(90vh)",
  maxHeight: "fit-content",
  background: "white",
  borderRadius: ".5rem",
};

export const contentBoxStyle: SxProps = {
  borderRadius: ".2rem",
  padding: "2rem 3rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  maxHeight: "100%",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.8rem",
    height: "0.8rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(170,170,170,1)",
    borderRadius: "0.3rem",
  },
};
