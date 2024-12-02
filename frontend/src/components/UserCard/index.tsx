import { forwardRef, useEffect, useRef, useState } from "react";

import { Box, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import {
  displayNameStyle,
  functionsStyle,
  lastAppointmentDateStyle,
  pictureStyle,
  statusBoxStyle,
  StatusColor,
  statusStyle,
  textWrapperStyle,
  topTextWrapperStyle,
  WrapperUserCard,
} from "./style";
import { UserCardProps } from "./types";
import { NoAvatar } from "../SVG/NoAvatar";
import { USER_STATUS } from "~/providers/FindAppointmentsProvider/enums";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";
import { GREY } from "~/styles/color.constants";

export const UserCard = forwardRef<HTMLDivElement, UserCardProps>(
  ({ infos }, ref) => {
    const { picture, displayName, functions, lastAppointmentDate, status } =
      infos;
    const [isElipsisDisplayName, setIsElipsisDisplayName] = useState(false);
    const [isElipsisfunctions, setIsElipsisfunctions] = useState(false);

    const { t } = useTranslation("appointments");
    const { handleOnClickCard } = useTakeAppointmentModal();

    const displayNameRef = useRef<HTMLDivElement>(null);
    const functionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (displayNameRef.current) {
        const { scrollWidth, clientWidth } = displayNameRef.current;
        setIsElipsisDisplayName(scrollWidth > clientWidth);
      }
    }, [displayName]);

    useEffect(() => {
      if (functionsRef.current) {
        const { scrollWidth, clientWidth } = functionsRef.current;
        setIsElipsisfunctions(scrollWidth > clientWidth);
      }
    }, [functions]);

    const userLanguage = navigator.language.split("-")[0] || "en";
    const lastAppointmentDateDisplayFormat = lastAppointmentDate
      ? dayjs(infos.lastAppointmentDate)
          .locale(userLanguage)
          .format("D MMMM YYYY")
      : null;

    return (
      <WrapperUserCard
        status={infos.status}
        ref={ref}
        onClick={() =>
          handleOnClickCard(status === USER_STATUS.AVAILABLE ? infos : null)
        }
      >
        <Box sx={pictureStyle}>
          {!(picture && picture.startsWith("/userbook/avatar/")) ? (
            <NoAvatar fill={GREY} />
          ) : (
            <Box alt="user picture" component="img" src={picture} />
          )}
        </Box>
        <Box sx={textWrapperStyle}>
          <Box sx={topTextWrapperStyle}>
            <Tooltip
              title={isElipsisDisplayName ? displayName : ""}
              placement="top"
            >
              <Typography
                variant="h5"
                sx={displayNameStyle}
                ref={displayNameRef}
              >
                {displayName}
              </Typography>
            </Tooltip>
            <Tooltip
              title={isElipsisfunctions ? functions : ""}
              placement="bottom"
            >
              <Typography sx={functionsStyle} ref={functionsRef}>
                {functions}
              </Typography>
            </Tooltip>
            <Typography sx={lastAppointmentDateStyle}>
              {lastAppointmentDateDisplayFormat}
            </Typography>
          </Box>
          <Box sx={statusBoxStyle}>
            <StatusColor status={status} />
            <Typography sx={statusStyle}>
              {t("appointments." + status.toLowerCase())}
            </Typography>
          </Box>
        </Box>
      </WrapperUserCard>
    );
  },
);
