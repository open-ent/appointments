import { FC } from "react";

import {
  Box,
  Button,
  Checkbox,
  Typography,
  common,
} from "@cgi-learning-hub/ui";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useTranslation } from "react-i18next";
import { v4 as uuid4v } from "uuid";

import { DaySlots } from "~/components/DaySlots";
import { APPOINTMENTS, DAY_VALUES } from "~/core/constants";
import { isToday } from "~/core/utils";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
import { flexStartBoxStyle, spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { ArrowButton } from "../BookAppointmentWeekSlotsDesktop/style";
import {
  DaySlotsHeader,
  RowSlotsWrapper,
  containerStyle,
  dayStyle,
  nextTimeSlotStyle,
  nextTimeSlotTextStyle,
  noSlotStyle,
  weekDayStyle,
  weekSlotsWrapperStyle,
} from "./style";

export const BookAppointmentWeekSlotsMobile: FC = () => {
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
    <Box sx={containerStyle}>
      <Box sx={spaceBetweenBoxStyle}>
        <ArrowButton isVisible={canGoPrev} onClick={handlePreviousWeek}>
          <KeyboardArrowLeftIcon />
        </ArrowButton>
        <Typography variant="h5" fontWeight={"bold"}>
          {t("appointments.book.appointment.modal.change.week")}
        </Typography>
        <ArrowButton isVisible={canGoNext} onClick={handleNextWeek}>
          <KeyboardArrowRightIcon />
        </ArrowButton>
      </Box>
      <Box sx={flexStartBoxStyle}>
        <Box sx={weekSlotsWrapperStyle}>
          {currentSlots.map((daySlot, index) => (
            <RowSlotsWrapper
              isEmpty={!!daySlot.slots && !daySlot.slots.length}
              key={uuid4v()}
            >
              <DaySlotsHeader isToday={isToday(daySlot.day)}>
                <Typography sx={weekDayStyle}>
                  {t(DAY_VALUES[daySlot.weekDay].i18nKey)}
                </Typography>
                <Typography sx={dayStyle}>
                  {daySlot.day.format("D MMM")}
                </Typography>
              </DaySlotsHeader>
              {canGoNext && (
                <DaySlots key={index} slots={daySlot.slots} isMobile={true} />
              )}
            </RowSlotsWrapper>
          ))}
        </Box>
        {hasNoSlots &&
          (nextAvailableTimeSlot ? (
            <Button
              variant="text"
              sx={nextTimeSlotStyle}
              onClick={handleNextTimeSlot}
            >
              <Box sx={nextTimeSlotTextStyle}>
                <Typography variant="body2" color={common.black}>
                  {t("appointments.book.appointment.modal.next.slot")}&nbsp;
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={"bold"}>
                  {nextAvailableTimeSlot.format("dddd D MMMM")}
                </Typography>
              </Box>
              <KeyboardArrowRightIcon sx={{ color: common.black }} />
            </Button>
          ) : (
            <Typography variant="body2" sx={noSlotStyle}>
              {t("appointments.book.appointment.modal.no.slot")}
            </Typography>
          ))}
      </Box>
      {isVideoCallOptionVisible && (
        <Box sx={flexStartBoxStyle}>
          <Checkbox
            onChange={handleVideoCallCheckboxChange}
            checked={isVideoCallOptionChecked}
          />
          <Typography color="text.primary" fontSize="1.4rem">
            {t("appointments.book.appointment.modal.video.call.option")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
