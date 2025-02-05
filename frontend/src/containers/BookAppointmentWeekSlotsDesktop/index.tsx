import { FC } from "react";

import { Button, common } from "@cgi-learning-hub/ui";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Checkbox, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import { DaySlots } from "~/components/DaySlots";
import { APPOINTMENTS, DAY_VALUES } from "~/core/constants";
import { isToday } from "~/core/utils";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
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
  videoCallOptionStyle,
  weekDayStyle,
  weekSlotsWrapperStyle,
} from "./style";

export const BookAppointmentWeekSlotsDesktop: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);

  const {
    gridInfos,
    currentSlots,
    canGoNext,
    canGoPrev,
    hasNoSlots,
    nextAvailableTimeSlot,
    isVideoCallOptionChecked,
    handlePreviousWeek,
    handleNextWeek,
    handleNextTimeSlot,
    handleVideoCallCheckboxChange,
  } = useBookAppointmentModal();

  const isVideoCallOptionVisible = !!gridInfos?.videoCallLink;

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
              isToday={isToday(daySlot.day)}
            >
              <Typography sx={weekDayStyle}>
                {t(DAY_VALUES[daySlot.weekDay].i18nKey)}
              </Typography>
              <Typography sx={dayStyle}>
                {daySlot.day.locale("fr").format("D MMM")}
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
              <GoToNextTimeSlot
                isVideoCallOptionVisible={isVideoCallOptionVisible}
              >
                <Button
                  variant="text"
                  sx={nextTimeSlotButtonStyle}
                  onClick={handleNextTimeSlot}
                >
                  <Typography variant="body2" color={common.black}>
                    {t("appointments.book.appointment.modal.next.slot")}&nbsp;
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
            <NoSlots isVideoCallOptionVisible={isVideoCallOptionVisible}>
              <Box sx={emptyStateStyle}>
                <Typography
                  variant="body2"
                  fontStyle={"italic"}
                  color={common.black}
                >
                  {t("appointments.book.appointment.modal.no.slot")}
                </Typography>
              </Box>
            </NoSlots>
          )
        ) : (
          <Box sx={weekSlotsWrapperStyle}>
            {currentSlots.map((daySlot: any) => (
              <ColumnSlotsWrapper
                isEmpty={!!daySlot.slots && !daySlot.slots.length}
                isVideoCallOptionVisible={isVideoCallOptionVisible}
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
        {isVideoCallOptionVisible && (
          <Box sx={videoCallOptionStyle}>
            <Checkbox
              onChange={handleVideoCallCheckboxChange}
              checked={isVideoCallOptionChecked}
            />
            <Typography>
              {t("appointments.book.appointment.modal.video.call.option")}
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
