import { Box, styled } from "@cgi-learning-hub/ui";

import { flexStartBoxStyle } from "~/styles/boxStyles";
import { StyledBoxProps } from "./types";

export const StyledDailySlotBox = styled(Box)<StyledBoxProps>(
  ({
    isSlotError,
    theme: {
      palette: {
        error: { main },
      },
    },
  }) => ({
    boxShadow: "0px 0px 4px 0px #0000001F",
    borderRadius: "0.5rem",
    gap: "1rem",
    padding: "1rem",
    margin: "0.5rem 1rem",
    width: "fit-content",
    border: isSlotError ? `1px solid ${main}` : "1px solid transparent",
  }),
);

export const beginAndEndWrapperStyle = {
  ...flexStartBoxStyle,
  gap: "1rem",
  "@media (max-width: 500px)": {
    flexDirection: "column",
  },
};

export const beginAndEndBoxStyle = {
  ...flexStartBoxStyle,
  justifyContent: "space-between",
  gap: "1rem",
};

export const iconButtonStyle = {
  padding: ".5rem",
  width: "3.6rem",
  height: "3.6rem",
  marginY: "auto",
};

export const iconStyle = {
  color: "primary.main",
  fontSize: "2rem",
};

export const timePickerStyle = {
  maxWidth: "120px",
  "& .MuiPickersInputBase-root": {
    height: "4.5rem",
  },
};
