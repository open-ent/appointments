import React, { useEffect } from "react";

import {
  ThemeProvider as ThemeProviderCGI,
  ThemeProviderProps,
} from "@cgi-learning-hub/theme";
// Le bootstrap openent n'est plus bundlé : il est chargé au runtime via
// <link href="/assets/themes/openent-bootstrap/index.css"> dans index.html
// (cf. README-THEME). Permet de changer le look sans recompiler le module.
import { EdificeClientProvider, EdificeThemeProvider } from "@open-ent/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "~/i18n";

import "react-toastify/dist/ReactToastify.css";

import dayjs from "dayjs";
import "dayjs/locale/fr";
import { useTranslation } from "react-i18next";
import {
  APPOINTMENTS,
  DEFAULT_MIN_HOURS_BEFORE_MODIFICATION,
  DEFAULT_THEME,
  TOAST_CONFIG,
} from "./core/constants";
import { useTheme } from "./hooks/useTheme";
import { AvailabilityProvider } from "./providers/AvailabilityProvider";
import { BookAppointmentModalProvider } from "./providers/BookAppointmentModalProvider";
import { FindAppointmentsProvider } from "./providers/FindAppointmentsProvider";
import { GlobalProvider } from "./providers/GlobalProvider";
import { GridModalProvider } from "./providers/GridModalProvider";
import { MyAppointmentsProvider } from "./providers/MyAppointmentsProvider";
import { router } from "./routes";
import { setupStore } from "./store";
import { options } from "./styles/theme";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// Config

const minHoursBeforeCancellation = parseInt(
  rootElement?.getAttribute("data-min-hours") ??
    DEFAULT_MIN_HOURS_BEFORE_MODIFICATION.toString(),
);

const themePlatform = (rootElement?.getAttribute("data-theme") ??
  DEFAULT_THEME) as ThemeProviderProps["themeId"];

if (process.env.NODE_ENV !== "production") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, root, 1000);
  });
}

const store = setupStore();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (error === "0090") window.location.replace("/auth/login");
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

dayjs.locale("fr");

const App = () => {
  // Charge le namespace i18n de l'app (t n'est plus utilisé ici directement).
  useTranslation(APPOINTMENTS);
  const { isTheme1D } = useTheme();

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main || (main.classList.contains("theme-1d") && isTheme1D)) return;
    if (isTheme1D) main.classList.add("theme-1d");
    else main.classList.remove("theme-1d");
  }, [isTheme1D]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <EdificeClientProvider
          params={{
            // Code applicatif (préfixe de route), PAS le libellé traduit : le framework
            // l'utilise comme currentApp pour /{app}/conf/public et le chargement i18n.
            // « Rendez-vous » (titre FR) provoquait GET /Rendez-vous/conf/public -> 404.
            app: APPOINTMENTS,
          }}
        >
          <EdificeThemeProvider>
            <ThemeProviderCGI
              themeId={isTheme1D ? "ent1D" : themePlatform ?? "default"}
              options={options}
            >
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="fr"
              >
                <GlobalProvider
                  minHoursBeforeCancellation={minHoursBeforeCancellation}
                >
                  <FindAppointmentsProvider>
                    <BookAppointmentModalProvider>
                      <GridModalProvider>
                        <AvailabilityProvider>
                          <MyAppointmentsProvider>
                            <ToastContainer {...TOAST_CONFIG} />
                            <RouterProvider router={router} />
                          </MyAppointmentsProvider>
                        </AvailabilityProvider>
                      </GridModalProvider>
                    </BookAppointmentModalProvider>
                  </FindAppointmentsProvider>
                </GlobalProvider>
              </LocalizationProvider>
            </ThemeProviderCGI>
          </EdificeThemeProvider>
        </EdificeClientProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

root.render(<App />);
