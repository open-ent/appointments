import { FC, SyntheticEvent, useState } from "react";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { ID } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import {
  appointmentsIconStyle,
  contentStyle,
  homeStyle,
  tabItemStyle,
  tabsStyle,
  titleStyle,
} from "./style";
import { AppointmentsIcon } from "~/components/SVG/AppointmentsIcon";
import { FindAppointments } from "~/containers/FindAppointments";
import { MyAppointments } from "~/containers/MyAppointments";
import { MyAvailability } from "~/containers/MyAvailability";
import { useFindAppointments } from "~/providers/FindAppointmentsProvider";
import { useGlobal } from "~/providers/GlobalProvider";
import { MyAppointmentsProvider } from "~/providers/MyAppointmentsProvider";
import { PURPLE } from "~/styles/color.constants";

export interface AppProps {
  _id: string;
  created: Date;
  description: string;
  map: string;
  modified: Date;
  name: string;
  owner: { userId: ID; displayName: string };
  shared: any[];
  thumbnail: string;
}

export const Home: FC = () => {
  const { hasManageRight } = useGlobal();
  const { resetSearch } = useFindAppointments();

  const initialTabValue = parseInt(sessionStorage.getItem("tabValue") || "0");
  const [tabValue, setTabValue] = useState(
    hasManageRight && initialTabValue === 2 ? 0 : initialTabValue,
  );
  const { t } = useTranslation("appointments");

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    tabValue === 0 && resetSearch();
    sessionStorage.setItem("tabValue", newValue.toString());
  };

  return (
    <Box sx={homeStyle}>
      <Box sx={titleStyle}>
        <Box sx={appointmentsIconStyle}>
          <AppointmentsIcon fill={PURPLE} />
        </Box>
        <Typography variant="h1">{t("appointments.title")}</Typography>
      </Box>
      <Box sx={contentStyle}>
        <Tabs
          sx={tabsStyle}
          value={tabValue}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons={false}
        >
          <Tab label={t("appointments.find.appointment")} />
          <Tab label={t("appointments.my.appointments")} />
          {hasManageRight && <Tab label={t("appointments.my.availability")} />}
        </Tabs>
        <Box sx={tabItemStyle}>
          {tabValue === 0 && <FindAppointments />}
          {tabValue === 1 && (
            <MyAppointmentsProvider>
              <MyAppointments />
            </MyAppointmentsProvider>
          )}
          {tabValue === 2 && hasManageRight && <MyAvailability />}
        </Box>
      </Box>
    </Box>
  );
};
