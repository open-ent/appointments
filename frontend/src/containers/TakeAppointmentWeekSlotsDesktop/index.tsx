import { FC } from "react";

// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Checkbox, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import {
  ColumnSlotsWrapper,
  containerStyle,
  daySlotsHeaderStyle,
  daySlotsWrapperStyle,
  dayStyle,
  headerStyle,
  visioOptionStyle,
  weekDayStyle,
  weekSlotsWrapperStyle,
} from "./style";
import { MODAL_SIZE } from "../TakeAppointmentModal/enum";
import { DaySlots } from "~/components/DaySlots";
import { useTakeAppointmentModal } from "~/providers/TakeAppointmentModalProvider";
import { flexStartBoxStyle } from "~/styles/boxStyles";

export const TakeAppointmentWeekSlotsDesktop: FC = () => {
  const { t } = useTranslation("appointments");

  const { gridSlots } = useTakeAppointmentModal();
  return (
    <Box sx={containerStyle}>
      <Box sx={headerStyle}>
        {gridSlots.map((daySlot) => (
          <ColumnSlotsWrapper
            isEmpty={!daySlot.slots.length}
            sx={daySlotsHeaderStyle}
            key={uuidv4()}
          >
            <Typography sx={weekDayStyle}>
              {t(`appointments.${daySlot.weekDay.toLowerCase()}`)}
            </Typography>
            <Typography sx={dayStyle}>
              {daySlot.day.locale("fr").format("D MMMM")}
            </Typography>
          </ColumnSlotsWrapper>
        ))}
      </Box>
      <Box sx={weekSlotsWrapperStyle}>
        {gridSlots.map((daySlot) => (
          <ColumnSlotsWrapper
            isEmpty={!daySlot.slots.length}
            sx={daySlotsWrapperStyle}
            key={uuidv4()}
          >
            <DaySlots
              key={uuidv4()}
              slots={daySlot.slots}
              modalSize={MODAL_SIZE.LARGE}
            />
          </ColumnSlotsWrapper>
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
