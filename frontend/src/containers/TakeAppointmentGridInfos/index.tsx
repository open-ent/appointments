import { FC } from "react";

import ChatIcon from "@mui/icons-material/Chat";
import PlaceIcon from "@mui/icons-material/Place";
import TimerIcon from "@mui/icons-material/Timer";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  bottomUserInfoStyle,
  displayNameStyle,
  functionsStyle,
  itemStyle,
  pictureStyle,
  skeletonStyle,
  StatusCircle,
  topUserInfoStyle,
  wrapperUserInfoStyle,
} from "./style";
import { TakeAppointmentGridInfosProps } from "./types";
import { NoAvatar } from "~/components/SVG/NoAvatar";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";
import { GREY } from "~/styles/color.constants";

// this container is the first part of TakeAppointmentModal
export const TakeAppointmentGridInfos: FC<TakeAppointmentGridInfosProps> = ({
  userInfos,
}) => {
  const { picture, displayName, functions, isAvailable } = userInfos;
  const { t } = useTranslation("appointments");
  const { grids, gridInfos, selectedGrid, handleGridChange } =
    useTakeAppointmentModal();

  const { duration, visioLink, place, publicComment } = gridInfos || {};

  return (
    <Box sx={wrapperUserInfoStyle}>
      <Box sx={topUserInfoStyle}>
        <Box sx={pictureStyle}>
          {!(picture && picture.startsWith("/userbook/avatar/")) ? (
            <NoAvatar fill={GREY} />
          ) : (
            <Box alt="user picture" component="img" src={picture} />
          )}
          <StatusCircle isAvailable={isAvailable} />
        </Box>
        <Box>
          <Typography sx={displayNameStyle}>{displayName}</Typography>
          <Typography sx={functionsStyle}>{functions}</Typography>
        </Box>
      </Box>
      {!gridInfos ? (
        <Skeleton variant="rectangular" sx={skeletonStyle} />
      ) : (
        <Box sx={bottomUserInfoStyle}>
          <FormControl variant="standard">
            <InputLabel>
              {t("appointments.take.appointment.modal.time.grid")}
            </InputLabel>
            <Select
              variant="standard"
              value={selectedGrid?.name ?? ""}
              onChange={(e) => handleGridChange(e.target.value as string)}
            >
              {grids?.map((grid) => (
                <MenuItem key={grid.id} value={grid.name}>
                  {grid.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={itemStyle}>
            {visioLink ? <VideoCameraFrontIcon /> : <VideocamOffIcon />}
            <Typography>
              {t(
                `appointments.take.appointment.modal.visio.${
                  visioLink ? "possible" : "impossible"
                }`,
              )}
            </Typography>
          </Box>
          <Box sx={itemStyle}>
            <TimerIcon />
            <Typography>{duration}</Typography>
          </Box>
          {!!place && (
            <Box sx={itemStyle}>
              <PlaceIcon />
              <Typography>{place}</Typography>
            </Box>
          )}
          {!!publicComment && (
            <Box sx={itemStyle}>
              <ChatIcon />
              <Typography>{publicComment}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
