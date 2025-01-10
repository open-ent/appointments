import { SxProps } from "@mui/material";

export const containerStyle: SxProps = {
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  width: "100%",
  gap: "1.6rem",
};

export const wrapperListBox: SxProps = {
  display: "flex",
  gap: "4rem",
};

export const paginationBoxStyle: SxProps = {
  display: "flex",
  justifyContent: "center",
  minHeight: "3.2rem",
};

export const paginationStyle: SxProps = {
  marginBottom: "1.6rem",

  "& .MuiPaginationItem-root": {
    margin: "0",
  },
};
