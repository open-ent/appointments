import { styled, SxProps } from "@cgi-learning-hub/ui";

import { flexEndBoxStyle, spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const firstLineStyle: SxProps = {
  ...spaceBetweenBoxStyle,
  flexWrap: "wrap",
  columnGap: "2rem",
};

export const nameStyle: SxProps = {
  flex: "1 1 60%",
};

export const colorStyle: SxProps = {
  ...flexEndBoxStyle,
  width: "fit-content",
  gap: "1rem",
};

export const selectStyle: SxProps = {
  "&.Mui-disabled": {
    "& .MuiSelect-icon ": {
      display: "none",
    },
  },
};

export const VisuallyHiddenInput = styled("input")({
  display: "none",
});

export const documentBoxStyle: SxProps = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  "@media (max-width: 550px)": {
    flexDirection: "column",
  },
};

export const addDocumentStyle: SxProps = {
  minWidth: "fit-content",
};

export const docsInfosStyle: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  "@media (max-width: 550px)": {
    alignItems: "flex-start",
  },
};
