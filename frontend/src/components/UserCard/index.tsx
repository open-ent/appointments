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
import { UserPicture } from "../UserPicture";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";

export const UserCard = forwardRef<HTMLDivElement, UserCardProps>(
  ({ infos }, ref) => {
    const {
      picture,
      displayName,
      functions,
      lastAppointmentDate,
      isAvailable,
    } = infos;
    const [isEllipsisDisplayName, setIsEllipsisDisplayName] = useState(false);
    const [isEllipsisfunctions, setIsEllipsisfunctions] = useState(false);

    const { t } = useTranslation("appointments");
    const { handleOnClickCard } = useBookAppointmentModal();

    const displayNameRef = useRef<HTMLDivElement>(null);
    const functionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (displayNameRef.current) {
        const { scrollWidth, clientWidth } = displayNameRef.current;
        setIsEllipsisDisplayName(scrollWidth > clientWidth);
      }
    }, [displayName]);

    useEffect(() => {
      if (functionsRef.current) {
        const { scrollWidth, clientWidth } = functionsRef.current;
        setIsEllipsisfunctions(scrollWidth > clientWidth);
      }
    }, [functions]);

    const userLanguage = navigator.language.split("-")[0] || "en";
    const lastAppointmentDateDisplayFormat = lastAppointmentDate
      ? dayjs(lastAppointmentDate).locale(userLanguage).format("D MMMM YYYY")
      : null;

    return (
      <WrapperUserCard
        isAvailable={isAvailable}
        ref={ref}
        onClick={() => handleOnClickCard(isAvailable ? infos : null)}
      >
        <Box sx={pictureStyle}>
          <UserPicture picture={picture} />
        </Box>
        <Box sx={textWrapperStyle}>
          <Box sx={topTextWrapperStyle}>
            <Tooltip
              title={isEllipsisDisplayName ? displayName : ""}
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
              title={isEllipsisfunctions ? functions.join(", ") : ""}
              placement="bottom"
            >
              <Typography sx={functionsStyle} ref={functionsRef}>
                {functions.join(", ")}
              </Typography>
            </Tooltip>
            <Typography sx={lastAppointmentDateStyle}>
              {t("appointments.last.appointment", {
                date: lastAppointmentDateDisplayFormat,
              })}
            </Typography>
          </Box>
          <Box sx={statusBoxStyle}>
            <StatusColor isAvailable={isAvailable} />
            <Typography sx={statusStyle}>
              {t("appointments." + (isAvailable ? "available" : "unavailable"))}
            </Typography>
          </Box>
        </Box>
      </WrapperUserCard>
    );
  },
);
