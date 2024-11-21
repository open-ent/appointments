import { FC } from "react";

import { IconButton } from "@cgi-learning-hub/ui";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PlaceIcon from "@mui/icons-material/Place";
import TimerIcon from "@mui/icons-material/Timer";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import {
  Box,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  closeIconStyle,
  wrapperContentBoxStyle,
  wrapperUserInfoStyle,
  topUserInfoStyle,
  pictureStyle,
  StatusCircle,
  displayNameStyle,
  professionStyle,
  bottomUserInfoStyle,
  itemStyle,
  wrapperWeekSlotsStyle,
} from "./style";
import { TakeAppointmentGridInfosProps } from "./types";
import { NoAvatar } from "~/components/SVG/NoAvatar";
import { useFindAppointmentsProvider } from "~/providers/FindAppointmentsProvider";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { GREY } from "~/styles/color.constants";

export const TakeAppointmentGridInfos: FC<TakeAppointmentGridInfosProps> = ({
  userInfos,
  gridsName,
  gridInfo,
}) => {
  const { t } = useTranslation("appointments");
  const { setIsModalOpen } = useFindAppointmentsProvider();
  return (
    <>
      <Box sx={spaceBetweenBoxStyle}>
        <Typography variant="h3">
          {t("appointments.take.appointment.modal.title")}
        </Typography>
        <IconButton
          sx={closeIconStyle}
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={wrapperContentBoxStyle}>
        <Box sx={wrapperUserInfoStyle}>
          <Box sx={topUserInfoStyle}>
            <Box sx={pictureStyle}>
              {!userInfos.profilePicture && <NoAvatar fill={GREY} />}
              <StatusCircle status={userInfos.status} />
            </Box>
            <Box>
              <Typography sx={displayNameStyle}>
                {userInfos.displayName}
              </Typography>
              <Typography sx={professionStyle}>
                {userInfos.profession}
              </Typography>
            </Box>
          </Box>
          <Box sx={bottomUserInfoStyle}>
            <FormControl variant="standard">
              <InputLabel>
                {t("appointments.take.appointment.modal.time.grid")}
              </InputLabel>
              <Select variant="standard">
                {gridsName.map((gridName) => (
                  <MenuItem key={gridName} value={gridName}>
                    {gridName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={itemStyle}>
              {gridInfo.visio ? <VideoCameraFrontIcon /> : <VideocamOffIcon />}
              <Typography>
                {t(
                  `appointments.take.appointment.modal.visio.${
                    gridInfo.visio ? "possible" : "impossible"
                  }`,
                )}
              </Typography>
            </Box>
            <Box sx={itemStyle}>
              <TimerIcon />
              <Typography>
                {gridInfo.slotDuration.toLocaleLowerCase()}
              </Typography>
            </Box>
            <Box sx={itemStyle}>
              <PlaceIcon />
              <Typography>{gridInfo.location}</Typography>
            </Box>
            <Box sx={itemStyle}>
              <ChatIcon />
              <Typography>{gridInfo.publicComment}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={wrapperWeekSlotsStyle}></Box>
      </Box>
    </>
  );
};
