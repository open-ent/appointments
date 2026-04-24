import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@cgi-learning-hub/ui";
import { ID } from "@edifice.io/client";
import { useSearchParams } from "react-router-dom";

import { AppointmentsIcon } from "~/components/SVG/AppointmentsIcon";
import { FindAppointments } from "~/containers/FindAppointments";
import { MyAppointments } from "~/containers/MyAppointments";
import { MyAvailability } from "~/containers/MyAvailability";
import { useFindAppointments } from "~/providers/FindAppointmentsProvider";
import { useGlobal } from "~/providers/GlobalProvider";
import {
  appointmentsIconStyle,
  contentStyle,
  headerStyle,
  homeStyle,
  tabItemStyle,
  tabsStyle,
  titleStyle,
} from "./style";
import { useTheme } from "~/hooks/useTheme";
import { centerBoxStyle } from "~/styles/boxStyles";
import { ExportAppointmentsModal } from "~/containers/ExportAppointmentsModal";
import { ModalType } from "~/providers/GlobalProvider/enum";
import { t } from "~/i18n";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useMyAppointments } from "~/providers/MyAppointmentsProvider";
import {
  THREE_TABS_EXPORT_BREAKPOINT,
  TWO_TABS_EXPORT_BREAKPOINT,
} from "~/core/breakpoints";
import { APPOINTMENT_STATE } from "~/core/enums";

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
  const {
    hasManageRight,
    setAppointmentIdFromNotify,
    setGridIdFromLink,
    toggleModal,
    displayModals: { showExportModal },
  } = useGlobal();
  const { resetSearch } = useFindAppointments();
  const {
    myAppointments,
    isExportingAppointments,
    handleExportMultipleAppointments,
  } = useMyAppointments();

  const initialTabValue = parseInt(sessionStorage.getItem("tabValue") || "0");
  const [tabValue, setTabValue] = useState(
    !hasManageRight && initialTabValue === 2 ? 0 : initialTabValue,
  );
  const { isTheme1D } = useTheme();
  const hasTwoTabs = useMediaQuery(
    `(max-width: ${TWO_TABS_EXPORT_BREAKPOINT}px)`,
  );
  const hasThreeTabs = useMediaQuery(
    `(max-width: ${THREE_TABS_EXPORT_BREAKPOINT}px)`,
  );
  const hasAccepted = (myAppointments.accepted?.total ?? 0) > 0;
  const hasCancelled =
    (myAppointments.rejected_or_canceled?.appointments.filter(
      (a) => a.state === APPOINTMENT_STATE.CANCELED,
    ).length ?? 0) > 0;

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
      return;
    }

    const gridId = searchParams.get("gridId");
    if (gridId) {
      setGridIdFromLink(parseInt(gridId));
      handleChange({} as SyntheticEvent, 0);
      searchParams.delete("gridId");
      setSearchParams(searchParams);
    }
  }, [
    searchParams,
    setAppointmentIdFromNotify,
    setGridIdFromLink,
    handleChange,
    setSearchParams,
  ]);

  return (
    <Box sx={homeStyle}>
      <Box sx={titleStyle}>
        <Box sx={appointmentsIconStyle}>
          <AppointmentsIcon />
        </Box>
        <Typography
          variant="h1"
          color="primary"
          {...(!isTheme1D && { fontFamily: "Comfortaa", fontWeight: "bold" })}
        >
          {t("appointments.title")}
        </Typography>
      </Box>
      <Box sx={contentStyle}>
        <Box sx={headerStyle}>
          <Tabs
            sx={tabsStyle}
            value={tabValue}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
          >
            <Tab label={t("appointments.find.appointment")} />
            <Tab label={t("appointments.my.appointments")} />
            {hasManageRight && (
              <Tab label={t("appointments.my.availability")} />
            )}
          </Tabs>
          <Box
            sx={{
              ...(((!hasManageRight && hasTwoTabs) ||
                (hasManageRight && hasThreeTabs)) && {
                ...centerBoxStyle,
                marginTop: "1rem",
              }),
            }}
          >
            {(hasAccepted || hasCancelled) && tabValue === 1 && (
              <Button
                color={"primary"}
                variant={"contained"}
                startIcon={<DownloadRoundedIcon />}
                loading={isExportingAppointments}
                onClick={() => toggleModal(ModalType.EXPORT)}
              >
                {t("appointments.event.export.all.button.title")}
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={tabItemStyle}>
          {tabValue === 0 && <FindAppointments />}
          {tabValue === 1 && <MyAppointments />}
          {tabValue === 2 && hasManageRight && <MyAvailability />}
        </Box>
      </Box>
      <ExportAppointmentsModal
        hasOnlyCancelled={hasCancelled && !hasAccepted}
        isOpen={showExportModal}
        handleClose={() => toggleModal(ModalType.EXPORT)}
        handleExport={() => {
          void handleExportMultipleAppointments(hasAccepted, hasCancelled);
        }}
      />
    </Box>
  );
};
