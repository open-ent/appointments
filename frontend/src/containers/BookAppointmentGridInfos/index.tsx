import { FC, useRef } from "react";

import {
  Box,
  EllipsisWithTooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@cgi-learning-hub/ui";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChatIcon from "@mui/icons-material/Chat";
import PlaceIcon from "@mui/icons-material/Place";
import TimerIcon from "@mui/icons-material/Timer";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useTranslation } from "react-i18next";

import { UserPicture } from "~/components/UserPicture";
import { APPOINTMENTS, DURATION_VALUES } from "~/core/constants";
import { DURATION } from "~/core/enums";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
import {
  bottomUserInfoStyle,
  itemStyle,
  pictureBoxStyle,
  pictureStyle,
  skeletonStyle,
  StatusCircle,
  topUserInfoStyle,
  wrapperUserInfoStyle,
} from "./style";
import { BookAppointmentGridInfosProps } from "./types";

import { Link } from "@cgi-learning-hub/ui";

// this container is the first part of BookAppointmentModal
export const BookAppointmentGridInfos: FC<BookAppointmentGridInfosProps> = ({
  userInfos,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const { picture, displayName, functions, isAvailable } = userInfos;
  const { t } = useTranslation(APPOINTMENTS);
  const { grids, gridInfos, selectedGrid, handleGridChange } =
    useBookAppointmentModal();

  const { duration, videoCallLink, place, publicComment, documents } =
    gridInfos || {};

  return (
    <Box sx={wrapperUserInfoStyle}>
      <Box sx={topUserInfoStyle}>
        <Box sx={pictureBoxStyle}>
          <Box sx={pictureStyle}>
            <UserPicture picture={picture} />
          </Box>
          <StatusCircle isAvailable={isAvailable} />
        </Box>
        <Box>
          <Typography color="text.primary" fontSize="1.8rem" fontWeight="bold">
            {displayName}
          </Typography>
          <Typography fontSize="1.3rem" color="text.primary">
            {functions.join(", ")}
          </Typography>
        </Box>
      </Box>
      {!gridInfos ? (
        <Skeleton variant="rectangular" sx={skeletonStyle} />
      ) : (
        <Box sx={bottomUserInfoStyle}>
          <FormControl variant="standard">
            <InputLabel>
              {t("appointments.book.appointment.modal.time.grid")}
            </InputLabel>
            <Select
              variant="standard"
              value={selectedGrid?.id ?? ""}
              onChange={(e) => handleGridChange(e.target.value as number)}
              ref={selectRef}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxWidth: '100% !important',
                    width: (selectRef.current?.offsetWidth || 'auto') + 'px !important',
                  },
                },
              }}
            >
              {grids?.map((grid) => (
                <MenuItem
                  key={grid.id}
                  value={grid.id}
                >
                  <EllipsisWithTooltip>{grid.name}</EllipsisWithTooltip>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={itemStyle}>
            {videoCallLink ? <VideoCameraFrontIcon /> : <VideocamOffIcon />}
            <Typography variant="body2" color="text.primary">
              {t(
                `appointments.book.appointment.modal.video.call.${
                  videoCallLink ? "possible" : "impossible"
                }`,
              )}
            </Typography>
          </Box>
          <Box sx={itemStyle}>
            <TimerIcon />
            <Typography variant="body2" color="text.primary">
              {t("appointments.slots") +
                " : " +
                DURATION_VALUES[duration ?? DURATION.FIFTEEN_MINUTES]
                  .displayValue}
            </Typography>
          </Box>
          {!!place && (
            <Box sx={itemStyle}>
              <PlaceIcon />
              <EllipsisWithTooltip
                typographyProps={{ variant: "body2", color: "text.primary" }}
              >
                {place}
              </EllipsisWithTooltip>
            </Box>
          )}
          {!!(documents && documents.length) && (
            <Box sx={itemStyle}>
              <AttachFileIcon />
              <Stack direction="column" maxWidth="90%">
                {documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/workspace/document/${doc.id}`}
                    underline="hover"
                    target="_blank"
                  >
                    <EllipsisWithTooltip typographyProps={{ variant: "body2" }}>
                      {doc.name}
                    </EllipsisWithTooltip>
                  </Link>
                ))}
              </Stack>
            </Box>
          )}
          {!!publicComment && (
            <Box sx={itemStyle}>
              <ChatIcon />
              <Stack maxWidth="90%">
                <EllipsisWithTooltip
                  typographyProps={{
                    variant: "body2",
                    color: "text.primary",
                    fontStyle: "italic",
                    whiteSpace: "pre-line",
                  }}
                >
                  {publicComment}
                </EllipsisWithTooltip>
              </Stack>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
