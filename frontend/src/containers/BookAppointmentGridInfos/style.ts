import { Box, styled, SxProps } from "@cgi-learning-hub/ui";

import { columnBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";
import {
  USER_STATUS_AVAILABLE_COLOR,
  USER_STATUS_UNAVAILABLE_COLOR,
} from "~/styles/color.constants";
import { StatusCircleProps } from "./types";

export const wrapperUserInfoStyle: SxProps = {
  ...columnBoxStyle,
  minWidth: "30rem",
  maxWidth: "50rem",
  gap: "2rem",
};

export const topUserInfoStyle: SxProps = {
  ...flexStartBoxStyle,
  gap: "2rem",
};

export const bottomUserInfoStyle: SxProps = {
  ...columnBoxStyle,
  backgroundColor: "grey.light",
  padding: "1.6rem",
  gap: "1rem",
  borderRadius: ".5rem",
  opacity: 0,
  animation: "fadeIn .3s ease-in-out forwards",
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  "& .MuiSvgIcon-root": {
    fontSize: "2.3rem",
    color: "grey.dark",
  },
  "&::-webkit-scrollbar": {
    width: "0.6rem",
    height: "0.8rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "divider",
    borderRadius: "0.3rem",
  },
  maxHeight: "31rem",
  overflowY: "auto",
};

export const skeletonStyle: SxProps = {
  height: "21rem",
  borderRadius: ".5rem",
  backgroundColor: "grey.light",
};

export const itemStyle: SxProps = {
  ...flexStartBoxStyle,
  alignItems: "flex-start",
  gap: "1rem",
  maxWidth: "100%",
};

export const pictureStyle: SxProps = {
  overflow: "hidden",
  borderRadius: "50%",
  display: "flex",
  minWidth: "6rem",
  maxWidth: "6rem",
  minHeight: "6rem",
  maxHeight: "6rem",
};

export const pictureBoxStyle: SxProps = {
  minWidth: "6rem",
  maxWidth: "6rem",
  minHeight: "6rem",
  maxHeight: "6rem",
  position: "relative",
  display: "flex",
};

export const imageStyle: SxProps = {
  objectFit: "cover",
  width: "100%",
  height: "100%",
};

export const StatusCircle = styled(Box)<StatusCircleProps>(
  ({ isAvailable }) => ({
    minWidth: "1.7rem",
    maxWidth: "1.7rem",
    minHeight: "1.7rem",
    maxHeight: "1.7rem",
    borderRadius: "50%",
    position: "absolute",
    transform: "translate(250%, 250%)",
    zIndex: 1000,
    backgroundColor: isAvailable
      ? USER_STATUS_AVAILABLE_COLOR
      : USER_STATUS_UNAVAILABLE_COLOR,
  }),
);
