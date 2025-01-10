import { columnBoxStyle, flexStartBoxStyle } from "~/styles/boxStyles";

export const homeStyle = {
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  flexDirection: "column",
  backgroundColor: "white !important",
  boxShadow: "0px 4px 6px 2px rgba(0,0,0,0.1)",
  minHeight: "calc(100vh - 13rem)",
};

export const appointmentsIconStyle = {
  width: "3.5rem",
  height: "3.5rem",
};

export const titleStyle = {
  ...flexStartBoxStyle,
  alignItems: "flex-end",
  gap: "1.4rem",
  margin: "3rem 2rem",
};

export const contentStyle = {
  ...columnBoxStyle,
  padding: "1rem 6rem",
  "@media (max-width: 720px)": {
    padding: "1rem 1rem",
  },
};

export const tabsStyle = {
  borderBottom: 1,
  borderColor: "divider",
  width: "100%",
};

export const tabItemStyle = {
  padding: "3rem",
};
