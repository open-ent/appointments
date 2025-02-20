import { FC } from "react";

import { Box, useTheme } from "@cgi-learning-hub/ui";

import { NoAvatar } from "../SVG/NoAvatar";
import { UserPictureProps } from "./types";

export const UserPicture: FC<UserPictureProps> = ({ picture }) => {
  const isPictureValid = !!picture && picture.startsWith("/userbook/avatar/");
  const theme = useTheme();
  return isPictureValid ? (
    <Box
      alt="user picture"
      component="img"
      src={picture}
      sx={{ objectFit: "cover" }}
    />
  ) : (
    <NoAvatar fill={theme.palette.text.secondary} />
  );
};
