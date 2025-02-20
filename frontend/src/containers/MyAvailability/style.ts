import { SxProps } from "@cgi-learning-hub/ui";

import { columnBoxStyle, spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const headerStyle = {
  ...spaceBetweenBoxStyle,
  gap: "2rem",
  flexWrap: "wrap",
};

export const availabilityContainerStyle = {
  display: "flex",
  flexDirection: "column",
  columnBoxStyle,
  gap: "2rem",
};

export const emptyStateStyle: SxProps = {
  fontStyle: "italic",
};

export const emptyStateSvgStyle: SxProps = {
  width: "30rem",
  maxWidth: "100%",
};
