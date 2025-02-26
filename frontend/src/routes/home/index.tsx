import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";

import { Box, Tab, Tabs, Typography } from "@cgi-learning-hub/ui";
import { ID } from "@edifice.io/client";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { AppointmentsIcon } from "~/components/SVG/AppointmentsIcon";
import { FindAppointments } from "~/containers/FindAppointments";
import { MyAppointments } from "~/containers/MyAppointments";
import { MyAvailability } from "~/containers/MyAvailability";
import { APPOINTMENTS } from "~/core/constants";
import { useFindAppointments } from "~/providers/FindAppointmentsProvider";
import { useGlobal } from "~/providers/GlobalProvider";
import {
  appointmentsIconStyle,
  contentStyle,
  homeStyle,
  tabItemStyle,
  tabsStyle,
  titleStyle,
} from "./style";

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
  const { t } = useTranslation(APPOINTMENTS);

  const handleChange = useCallback(
    (_: SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
      if (tabValue === 0) resetSearch();
      sessionStorage.setItem("tabValue", newValue.toString());
    },
    [resetSearch, tabValue],
  );

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const appointmentId = searchParams.get("appointmentId");
    if (appointmentId) {
      setAppointmentIdFromNotify(parseInt(appointmentId));
      handleChange({} as SyntheticEvent, 1);
      searchParams.delete("appointmentId");
      setSearchParams(searchParams);
    }
  }, [searchParams, setAppointmentIdFromNotify, handleChange, setSearchParams]);

  return (
    <Box sx={homeStyle}>
      <Box sx={titleStyle}>
        <Box sx={appointmentsIconStyle}>
          <AppointmentsIcon />
        </Box>
        <Typography
          variant="h1"
          color="primary"
          fontFamily="Comfortaa"
          fontWeight="bold"
        >
          {t("appointments.title")}
        </Typography>
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
          {tabValue === 1 && <MyAppointments />}
          {tabValue === 2 && hasManageRight && <MyAvailability />}
        </Box>
      </Box>
    </Box>
  );
};
