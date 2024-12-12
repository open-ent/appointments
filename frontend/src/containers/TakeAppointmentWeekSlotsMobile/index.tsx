import { FC } from "react";

import { Button, common } from "@cgi-learning-hub/ui";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Checkbox, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { v4 as uuid4v } from "uuid";

import {
  RowSlotsWrapper,
  containerStyle,
  daySlotsHeaderStyle,
  dayStyle,
  nextTimeSlotStyle,
  nextTimeSlotTextStyle,
  noSlotStyle,
  visioOptionStyle,
  weekDayStyle,
  weekSlotsWrapperStyle,
} from "./style";
import { ArrowButton } from "../TakeAppointmentWeekSlotsDesktop/style";
import { DaySlots } from "~/components/DaySlots";
import { DAY_VALUES } from "~/core/constants";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";
import { flexStartBoxStyle, spaceBetweenBoxStyle } from "~/styles/boxStyles";

export const TakeAppointmentWeekSlotsMobile: FC = () => {
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
    <Box sx={containerStyle}>
      <Box sx={spaceBetweenBoxStyle}>
        <ArrowButton isVisible={canGoPrev} onClick={handlePreviousWeek}>
          <KeyboardArrowLeftIcon />
        </ArrowButton>
        <Typography variant="h5" fontWeight={"bold"}>
          {t("appointments.take.appointment.modal.change.week")}
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
              <Box sx={daySlotsHeaderStyle}>
                <Typography sx={weekDayStyle}>
                  {t(DAY_VALUES[daySlot.weekDay].i18nKey)}
                </Typography>
                <Typography sx={dayStyle}>
                  {daySlot.day.locale("fr").format("D MMMM")}
                </Typography>
              </Box>
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
                  {t("appointments.take.appointment.modal.next.slot")}&nbsp;
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={"bold"}>
                  {nextAvailableTimeSlot.locale("fr").format("dddd D MMMM")}
                </Typography>
              </Box>
              <KeyboardArrowRightIcon sx={{ color: common.black }} />
            </Button>
          ) : (
            <Typography variant="body2" sx={noSlotStyle}>
              {t("appointments.take.appointment.modal.no.slot")}
            </Typography>
          ))}
      </Box>
      {isVisioOptionVisible && (
        <Box sx={flexStartBoxStyle}>
          <Checkbox />
          <Typography sx={visioOptionStyle}>
            {t("appointments.take.appointment.modal.visio.option")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
