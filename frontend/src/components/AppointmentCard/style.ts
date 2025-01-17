import { Box, styled, SxProps } from "@mui/material";

import { CancelButtonBoxProps, StyledCardProps } from "./types";
import { columnBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";

export const StyledCard = styled(Box)<StyledCardProps>(({
  isAnimated,
  theme,
}) => {
  return {
    ...columnBoxStyle,
    padding: "2.4rem",
    borderRadius: "1rem",
    boxShadow: isAnimated
      ? `0px 2px 8px 4px ${theme.palette.primary.light}`
      : "0px 2px 8px 0px rgba(176, 176, 176, 0.25)",
    minWidth: "23rem",
    maxWidth: "23rem",
    gap: ".4rem",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0px 2px 16px 4px rgba(176, 176, 176, 0.25)",
    },
    "@keyframes flash": {
      "0%": {
        boxShadow: `0px 2px 8px 4px ${theme.palette.primary.light}`,
      },
      "50%": {
        boxShadow: `0px 2px 16px 8px ${theme.palette.primary.light}`,
      },
      "100%": {
        boxShadow: `0px 2px 8px 4px ${theme.palette.primary.light}`,
      },
    },
    animation: isAnimated ? "flash 1s ease-in-out" : "none",
  };
});

export const pictureStyle: SxProps = {
  minWidth: "6rem",
  maxWidth: "6rem",
  minHeight: "6rem",
  maxHeight: "6rem",
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  objectFit: "cover",
};

export const bottomWrapperBoxStyle: SxProps = {
  ...flexStartBoxStyle,
  gap: "1rem",
};

export const dateBoxStyle: SxProps = {
  ...columnBoxStyle,
  width: "4.2rem",
  alignItems: "center",
};

export const bottomRightBoxStyle: SxProps = {
  ...columnBoxStyle,
  justifyContent: "space-around",
  height: "7rem",
};

export const dividerStyle: SxProps = {
  borderColor: "divider",
  borderWidth: "0 0 0 1px",
};

export const iconsStyle: SxProps = {
  fontSize: "1.6rem",
};

export const rowBoxStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: "0.9rem",
};

export const twoButtonsBoxStyle: SxProps = {
  ...flexStartBoxStyle,
  gap: "1rem",
};

export const twoButtonsStyle = {
  width: "50%",
};

export const CancelButtonBox = styled(Box)<CancelButtonBoxProps>(
  (canCancelRequest) => ({
    cursor: canCancelRequest ? "default" : "pointer",
  }),
);
