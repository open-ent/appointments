import { Box, styled, SxProps } from "@cgi-learning-hub/ui";

import {
  columnBoxStyle,
  flexEndBoxStyle,
  flexStartBoxStyle,
} from "~/styles/boxStyles";
import { ContentWrapperProps } from "./types";

export const ModalContainer = styled(Box)<{ isMobile: boolean }>(
  ({ isMobile }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc( min(110rem, 95%))",
    maxWidth: isMobile ? "60rem" : "default",
    height: "80vh",
    maxHeight: "fit-content",
    background: "white",
    borderRadius: ".5rem",
  }),
);

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
    color: "text.primary",
  },
};

export const ContentWrapper = styled(Box)<ContentWrapperProps>(
  ({ isMobile }) => ({
    ...(isMobile ? columnBoxStyle : flexStartBoxStyle),
    alignItems: isMobile ? "center" : "flex-start",
    gap: "3rem",
    height: "100%",
  }),
);

export const submitButtonStyle: SxProps = {
  ...flexEndBoxStyle,
};
