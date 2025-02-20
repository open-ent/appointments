import { SxProps } from "@cgi-learning-hub/ui";

export const containerStyle: SxProps = {
  display: "flex",
  flex: "1 1 auto",
  minWidth: 0,
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
