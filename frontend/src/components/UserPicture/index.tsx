import { FC } from "react";

import { Box } from "@mui/material";

import { UserPictureProps } from "./types";
import { NoAvatar } from "../SVG/NoAvatar";
import { GREY } from "~/styles/color.constants";

export const UserPicture: FC<UserPictureProps> = ({ picture }) => {
  const isPictureValid = !!picture && picture.startsWith("/userbook/avatar/");
  return isPictureValid ? (
    <Box
      alt="user picture"
      component="img"
      src={picture}
      sx={{ objectFit: "cover" }}
    />
  ) : (
    <NoAvatar fill={GREY} />
  );
};
