import { SxProps, Theme } from "@mui/material";

import { centerBoxStyle } from "~/styles/boxStyles";

export const modalStyle: SxProps = {
  minWidth: "44rem",
  maxWidth: "44rem",
  maxHeight: "80vh",
  height: "fit-content",

  "& .MuiDialogTitle-root": {
    padding: "2rem",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "primary.main",
  },

  "& .MuiSvgIcon-root": {
    width: "2rem",
    height: "2rem",
  },
};

export const topContainerStyle: SxProps<Theme> = (theme: Theme) => ({
  display: "flex",
  border: "1px solid",
  borderColor: theme.palette.divider,
  borderRadius: "1rem",
  padding: "1.6rem",
  gap: "2.2rem",
});

export const dialogContentStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: "2.4rem",
};

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

export const bottomContainerStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: "1.6rem",
};

export const rowInfoStyle: SxProps = {
  display: "flex",
  gap: "1.6rem",
};

export const twoButtonsBoxStyle: SxProps = {
  ...centerBoxStyle,
  gap: "1rem",
};

export const twoButtonsStyle = {
  width: "16rem",
};

export const oneButtonBoxStyle: SxProps = {
  ...centerBoxStyle,
};

export const oneButtonStyle = {
  width: "20rem",
};

export const userInfosBoxStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
};

export const greyIconStyle: SxProps<Theme> = (theme: Theme) => ({
  color: theme.palette.grey[700],
});
