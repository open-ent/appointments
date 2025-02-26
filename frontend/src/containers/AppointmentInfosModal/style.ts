import { SxProps, Theme } from "@cgi-learning-hub/ui";

import { centerBoxStyle } from "~/styles/boxStyles";

export const modalStyle: SxProps = {
  minWidth: "44rem",
  maxWidth: "44rem",
  maxHeight: "90vh",
  height: "fit-content",
  overflowY: "scroll",

  "& .MuiSvgIcon-root": {
    width: "2rem",
    height: "2rem",
  },

  "&::-webkit-scrollbar": {
    width: "0.8rem",
    height: "0.8rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(170,170,170,1)",
    borderRadius: "0.3rem",
  },
};

export const topContainerStyle: SxProps<Theme> = (theme: Theme) => ({
  display: "flex",
  border: "1px solid",
  borderColor: theme.palette.divider,
  borderRadius: "1rem",
  padding: "1.6rem",
  gap: "2.2rem",
  maxWidth: "100%",
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
  maxWidth: "100%",
};

export const rowInfoStyle: SxProps = {
  display: "flex",
  gap: "1.6rem",
  maxWidth: "100%",
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
  maxWidth: "78%",
};

export const greyIconStyle: SxProps<Theme> = (theme: Theme) => ({
  color: theme.palette.grey[700],
});
