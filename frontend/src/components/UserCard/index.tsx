import { forwardRef, useEffect, useRef, useState } from "react";

import { Box, Tooltip, Typography } from "@cgi-learning-hub/ui";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS } from "~/core/constants";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
import { UserPicture } from "../UserPicture";
import {
  pictureStyle,
  statusBoxStyle,
  StatusColor,
  textWrapperStyle,
  topTextWrapperStyle,
  WrapperUserCard,
} from "./style";
import { UserCardProps } from "./types";

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

    const { t } = useTranslation(APPOINTMENTS);
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
                variant="body1"
                fontSize="1.6rem"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                fontWeight="bold"
                color="text.primary"
                ref={displayNameRef}
              >
                {displayName}
              </Typography>
            </Tooltip>
            <Tooltip
              title={isEllipsisfunctions ? functions.join(", ") : ""}
              placement="bottom"
            >
              <Typography
                variant="body2"
                fontSize="1.3rem"
                color="text.primary"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                ref={functionsRef}
              >
                {functions.join(", ")}
              </Typography>
            </Tooltip>
            <Typography
              variant="body2"
              fontSize="1.3rem"
              color="text.primary"
              fontStyle="italic"
            >
              {!!lastAppointmentDate &&
                t("appointments.last.appointment", {
                  date: lastAppointmentDateDisplayFormat,
                })}
            </Typography>
          </Box>
          <Box sx={statusBoxStyle}>
            <StatusColor isAvailable={isAvailable} />
            <Typography color="grey.dark" fontWeight="bold" fontSize="1.3rem">
              {t("appointments." + (isAvailable ? "available" : "unavailable"))}
            </Typography>
          </Box>
        </Box>
      </WrapperUserCard>
    );
  },
);
