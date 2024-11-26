import { Box, styled, SxProps } from "@mui/material";

import { MODAL_SIZE } from "./enum";
import { ContentWrapperProps } from "./types";
import {
  columnBoxStyle,
  flexEndBoxStyle,
  flexStartBoxStyle,
} from "~/styles/boxStyles";
import { BLACK } from "~/styles/color.constants";

export const modalBoxStyle: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc( min(110rem, 95%))",
  "@media (max-width: 1011px)": {
    maxWidth: "60rem",
  },
  height: "80vh",
  maxHeight: "fit-content",
  background: "white",
  borderRadius: ".5rem",
};

export const contentBoxStyle: SxProps = {
  borderRadius: ".2rem",
  padding: "2rem 3rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
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

export const closeIconStyle = {
  "& > .MuiSvgIcon-root": {
    fontSize: "2.4rem",
    color: BLACK,
  },
};

export const dividerStyle: SxProps = {
  borderColor: "divider",
};

export const ContentWrapper = styled(Box)<ContentWrapperProps>(
  ({ modalSize }) => ({
    ...(modalSize === MODAL_SIZE.SMALL ? columnBoxStyle : flexStartBoxStyle),
    alignItems: modalSize === MODAL_SIZE.SMALL ? "center" : "flex-start",
    gap: "3rem",
    height: "100%",
  }),
);

export const submitButtonStyle: SxProps = {
  ...flexEndBoxStyle,
  filter: "blur(0)",
};
