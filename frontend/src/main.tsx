import React from "react";

import { ThemeProvider as ThemeProviderCGI } from "@cgi-learning-hub/theme";
import { OdeClientProvider, ThemeProvider } from "@edifice-ui/react";
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
import "~/i18n";

import { AvailabilityProvider } from "./providers/AvailabilityProvider";
import { FindAppointmentsProvider } from "./providers/FindAppointmentsProvider";
import { GlobalProvider } from "./providers/GlobalProvider";
import { GridModalProvider } from "./providers/GridModalProvider";
import { TakeAppointmentModalProvider } from "./providers/TakeAppointmentModalProvider";
import { router } from "./routes";
import { setupStore } from "./store";
import { options } from "./styles/theme";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
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

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <OdeClientProvider
        params={{
          app: "appointments",
        }}
      >
        <ThemeProvider>
          <ThemeProviderCGI themeId={"default"} options={options}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
              <GlobalProvider>
                <FindAppointmentsProvider>
                  <TakeAppointmentModalProvider>
                    <AvailabilityProvider>
                      <GridModalProvider>
                        <RouterProvider router={router} />
                      </GridModalProvider>
                    </AvailabilityProvider>
                  </TakeAppointmentModalProvider>
                </FindAppointmentsProvider>
              </GlobalProvider>
            </LocalizationProvider>
          </ThemeProviderCGI>
        </ThemeProvider>
      </OdeClientProvider>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
