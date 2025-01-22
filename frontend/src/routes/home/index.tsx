import { FC, SyntheticEvent, useEffect, useState } from "react";

import { ID } from "@edifice.io/client";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

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
  const { hasManageRight, setAppointmentIdFromNotify } = useGlobal();
  const { resetSearch } = useFindAppointments();

  const initialTabValue = parseInt(sessionStorage.getItem("tabValue") || "0");
  const [tabValue, setTabValue] = useState(
    !hasManageRight && initialTabValue === 2 ? 0 : initialTabValue,
  );
  const { t } = useTranslation("appointments");

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    tabValue === 0 && resetSearch();
    sessionStorage.setItem("tabValue", newValue.toString());
  };

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const appointmentId = searchParams.get("appointmentId");
    if (appointmentId) {
      setAppointmentIdFromNotify(parseInt(appointmentId));
      handleChange({} as SyntheticEvent, 1);
      searchParams.delete("appointmentId");
      setSearchParams(searchParams);
    }
  }, [searchParams, setAppointmentIdFromNotify]);

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
