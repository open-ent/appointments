import { Box, styled, SxProps } from "@mui/material";

import { StatusCircleProps } from "./types";
import { USER_STATUS } from "~/providers/FindAppointmentsProvider/enums";
import { columnBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";
import {
  BLACK,
  GREY,
  LIGHTER_GREY,
  USER_STATUS_AVAILABLE_COLOR,
  USER_STATUS_UNAVAILABLE_COLOR,
} from "~/styles/color.constants";

export const closeIconStyle = {
  "& > .MuiSvgIcon-root": {
    fontSize: "2.4rem",
    color: BLACK,
  },
};

export const wrapperContentBoxStyle: SxProps = {
  ...flexStartBoxStyle,
  gap: "2rem",
};

export const wrapperUserInfoStyle: SxProps = {
  ...columnBoxStyle,
  gap: "2rem",
};

export const topUserInfoStyle: SxProps = {
  ...flexStartBoxStyle,
  gap: "2rem",
};

export const bottomUserInfoStyle: SxProps = {
  ...columnBoxStyle,
  backgroundColor: LIGHTER_GREY,
  padding: "1.6rem",
  gap: "1rem",
  borderRadius: ".5rem",
  "& .MuiSvgIcon-root": {
    fontSize: "2.3rem",
    color: GREY,
  },
};

export const itemStyle: SxProps = {
  ...flexStartBoxStyle,
  gap: "1rem",
};

export const wrapperWeekSlotsStyle: SxProps = {
  ...flexStartBoxStyle,
  gap: "2rem",
};

export const pictureStyle: SxProps = {
  minWidth: "6rem",
  maxWidth: "6rem",
  minHeight: "6rem",
  maxHeight: "6rem",
  borderRadius: "50%",
  overflow: "hidden",
};

export const StatusCircle = styled(Box)<StatusCircleProps>(({ status }) => ({
  minWidth: "1.7rem",
  maxWidth: "1.7rem",
  minHeight: "1.7rem",
  maxHeight: "1.7rem",
  borderRadius: "50%",
  position: "absolute",
  transform: "translate(250%, -80%)",
  zIndex: 1000,
  backgroundColor:
    status === USER_STATUS.AVAILABLE
      ? USER_STATUS_AVAILABLE_COLOR
      : USER_STATUS_UNAVAILABLE_COLOR,
}));

export const displayNameStyle: SxProps = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: BLACK,
};

export const professionStyle: SxProps = {
  fontSize: "1.3rem",
  color: BLACK,
};
