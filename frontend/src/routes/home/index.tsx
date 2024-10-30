import { FC, SyntheticEvent, useState } from "react";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { ID } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { contentStyle, homeStyle, tabsStyle, titleStyle } from "./style";
import { FindAppointments } from "~/containers/FindAppointments";
import { MyAppointments } from "~/containers/MyAppointments";
import { MyAvailability } from "~/containers/MyAvailability";

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
  const [tabValue, setTabValue] = useState(
    parseInt(sessionStorage.getItem("tabValue")!) | 0,
  );

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    sessionStorage.setItem("tabValue", newValue.toString());
  };

  const { t } = useTranslation("appointments");

  return (
    <Box sx={homeStyle}>
      <Box sx={titleStyle}>
        <Typography variant="h1">{t("appointments.title")}</Typography>
      </Box>
      <Box sx={contentStyle}>
        <Tabs sx={tabsStyle} value={tabValue} onChange={handleChange}>
          <Tab label={t("appointments.find.appointment")} />
          <Tab label={t("appointments.my.appointments")} />
          <Tab label={t("appointments.my.availability")} />
        </Tabs>
        {tabValue === 0 && <FindAppointments />}
        {tabValue === 1 && <MyAppointments />}
        {tabValue === 2 && <MyAvailability />}
      </Box>
    </Box>
  );
};
