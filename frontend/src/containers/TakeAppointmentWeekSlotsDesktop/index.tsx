import { FC } from "react";

import { Button, common } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Checkbox, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import {
  ArrowButton,
  ColumnHeader,
  ColumnSlotsWrapper,
  containerStyle,
  daySlotsWrapperStyle,
  dayStyle,
  emptyStateStyle,
  globalContainerStyle,
  GoToNextTimeSlot,
  headerStyle,
  nextTimeSlotButtonStyle,
  NoSlots,
  noSlotsStyle,
  noSlotsWrapperStyle,
  visioOptionStyle,
  weekDayStyle,
  weekSlotsWrapperStyle,
} from "./style";
import { isToday } from "./utils";
import { DaySlots } from "~/components/DaySlots";
import { DAY_VALUES } from "~/core/constants";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";
import { flexStartBoxStyle } from "~/styles/boxStyles";

export const TakeAppointmentWeekSlotsDesktop: FC = () => {
  const { t } = useTranslation("appointments");

  const {
    gridInfos,
    currentSlots,
    canGoNext,
    canGoPrev,
    hasNoSlots,
    nextAvailableTimeSlot,
    handlePreviousWeek,
    handleNextWeek,
    handleNextTimeSlot,
  } = useTakeAppointmentModal();

  const isVisioOptionVisible = !!gridInfos?.visioLink;

  return (
    <Box sx={globalContainerStyle}>
      <Box sx={{ filter: "blur(0)" }}>
        <ArrowButton isVisible={canGoPrev} onClick={handlePreviousWeek}>
          <KeyboardArrowLeftIcon />
        </ArrowButton>
      </Box>
      <Box sx={containerStyle}>
        <Box sx={headerStyle}>
          {currentSlots.map((daySlot) => (
            <ColumnHeader
              isEmpty={!!daySlot.slots && !daySlot.slots.length}
              key={uuidv4()}
              isToday={isToday(daySlot)}
            >
              <Typography sx={weekDayStyle}>
                {t(DAY_VALUES[daySlot.weekDay].i18nKey)}
              </Typography>
              <Typography sx={dayStyle}>
                {daySlot.day.locale("fr").format("D MMMM")}
              </Typography>
            </ColumnHeader>
          ))}
        </Box>
        {hasNoSlots ? (
          nextAvailableTimeSlot ? (
            <>
              <Box sx={noSlotsWrapperStyle}>
                {currentSlots.map(() => (
                  <Box sx={noSlotsStyle}>
                    <CloseIcon />
                  </Box>
                ))}
              </Box>
              <GoToNextTimeSlot isVisioOptionVisible={isVisioOptionVisible}>
                <Button
                  variant="text"
                  sx={nextTimeSlotButtonStyle}
                  onClick={handleNextTimeSlot}
                >
                  <Typography variant="body2" color={common.black}>
                    {t("appointments.take.appointment.modal.next.slot")}&nbsp;
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight={"bold"}
                  >
                    {nextAvailableTimeSlot.locale("fr").format("dddd D MMMM")}
                  </Typography>
                  <KeyboardArrowRightIcon sx={{ color: common.black }} />
                </Button>
              </GoToNextTimeSlot>
            </>
          ) : (
            <NoSlots isVisioOptionVisible={isVisioOptionVisible}>
              <Box sx={emptyStateStyle}>
                <Typography
                  variant="body2"
                  fontStyle={"italic"}
                  color={common.black}
                >
                  {t("appointments.take.appointment.modal.no.slot")}
                </Typography>
              </Box>
            </NoSlots>
          )
        ) : (
          <Box sx={weekSlotsWrapperStyle}>
            {currentSlots.map((daySlot: any) => (
              <ColumnSlotsWrapper
                isEmpty={!!daySlot.slots && !daySlot.slots.length}
                isVisioOptionVisible={isVisioOptionVisible}
                sx={daySlotsWrapperStyle}
                key={uuidv4()}
              >
                <DaySlots
                  key={uuidv4()}
                  slots={daySlot.slots}
                  isMobile={false}
                />
              </ColumnSlotsWrapper>
            ))}
          </Box>
        )}
        {isVisioOptionVisible && (
          <Box sx={flexStartBoxStyle}>
            <Checkbox />
            <Typography sx={visioOptionStyle}>
              {t("appointments.take.appointment.modal.visio.option")}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ filter: "blur(0)" }}>
        <ArrowButton isVisible={canGoNext} onClick={handleNextWeek}>
          <KeyboardArrowRightIcon />
        </ArrowButton>
      </Box>
    </Box>
  );
};
