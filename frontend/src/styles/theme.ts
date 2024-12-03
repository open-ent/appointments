// import { CreateThemeOptions } from "@cgi-learning-hub/theme";

import { ThemeOptions } from "@mui/material";

import { BLACK, GREY, PURPLE } from "./color.constants";

export const options: ThemeOptions = {
  palette: {
    background: {
      default: "#F9F9F9",
    },
    text: {
      primary: GREY,
    },
  },
  typography: {
    fontFamily: "Roboto",
    h1: {
      fontSize: "2.4rem",
      color: PURPLE,
      fontWeight: "bold",
      fontFamily: "Comfortaa",
    },
    h2: {
      fontSize: "2.2rem",
      color: PURPLE,
      fontWeight: "bold",
      fontFamily: "Roboto",
    },
    h3: {
      fontSize: "2rem",
      color: PURPLE,
      fontWeight: "bold",
      fontFamily: "Roboto",
    },
    h4: {
      fontSize: "2rem",
      color: GREY,
      fontFamily: "Roboto",
    },
    h5: {
      fontSize: "1.6rem",
      color: BLACK,
      fontFamily: "Roboto",
    },
    body1: {
      fontSize: "1.4rem",
      color: GREY,
      fontFamily: "Roboto",
    },
    body2: {
      fontSize: "1.4rem",
      color: PURPLE,
      fontFamily: "Roboto",
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
          fontWeight: "bold",
          border: "0 0 1px 0 solid #4D32A3",
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: "0.4rem",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
          fontWeight: "bold",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            fontSize: "2.1rem",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: PURPLE,
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            fontSize: "1.4rem",
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            fontSize: "1.4rem",
          },
        },
        {
          props: { variant: "text" },
          style: {
            fontSize: "1.4rem",
          },
        },
      ],
    },
    MuiMobileStepper: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
        dot: {
          backgroundColor: "#B0B0B0",
        },
        dotActive: {
          backgroundColor: PURPLE,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "0.8rem",
          fontSize: "1.4rem",
          padding: "1rem 1.6rem",
          whiteSpace: "nowrap",
          marginRight: "auto",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "1.2rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1.2rem",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            "&.Mui-selected": {
              backgroundColor: PURPLE,
              color: "white",
              "&:hover": {
                backgroundColor: PURPLE,
              },
            },
          },
        },
      },
    },
  },
};
