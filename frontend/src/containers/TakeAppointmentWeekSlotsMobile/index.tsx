import { FC } from "react";

// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Checkbox, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { v4 as uuid4v } from "uuid";

import {
  RowSlotsWrapper,
  containerStyle,
  daySlotsHeaderStyle,
  dayStyle,
  visioOptionStyle,
  weekDayStyle,
  weekSlotsWrapperStyle,
} from "./style";
import { MODAL_SIZE } from "../TakeAppointmentModal/enum";
import { DaySlots } from "~/components/DaySlots";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";
import { flexStartBoxStyle } from "~/styles/boxStyles";

export const TakeAppointmentWeekSlotsMobile: FC = () => {
  const { t } = useTranslation("appointments");

  const { gridSlots } = useTakeAppointmentModal();
  return (
    <Box sx={containerStyle}>
      <Box sx={weekSlotsWrapperStyle}>
        {gridSlots.map((daySlot, index) => (
          <RowSlotsWrapper isEmpty={!daySlot.slots.length} key={uuid4v()}>
            <Box sx={daySlotsHeaderStyle}>
              <Typography sx={weekDayStyle}>
                {t(`appointments.${daySlot.weekDay.toLowerCase()}`)}
              </Typography>
              <Typography sx={dayStyle}>
                {daySlot.day.locale("fr").format("D MMMM")}
              </Typography>
            </Box>
            <DaySlots
              key={index}
              slots={daySlot.slots}
              modalSize={MODAL_SIZE.SMALL}
            />
          </RowSlotsWrapper>
        ))}
      </Box>
      <Box sx={flexStartBoxStyle}>
        <Checkbox />
        <Typography sx={visioOptionStyle}>
          {t("appointments.take.appointment.modal.visio.option")}
        </Typography>
      </Box>
    </Box>
  );
};
