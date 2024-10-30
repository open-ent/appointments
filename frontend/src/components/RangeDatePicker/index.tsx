import { FC } from "react";

import RemoveIcon from "@mui/icons-material/Remove";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";

import { boxStyle, datePickerStyle } from "./style";
import { shouldDisableEndDate, shouldDisableStartDate } from "./utils";
import { useGridModalProvider } from "~/providers/GridModalProvider";

export const RangeDatePicker: FC = () => {
  const { t } = useTranslation("appointments");

  const {
    inputs,
    updateGridModalInputs: { handleStartDateChange, handleEndDateChange },
  } = useGridModalProvider();

  const startDate = inputs.validityPeriod.start;

  return (
    <Box sx={boxStyle}>
      <DatePicker
        sx={datePickerStyle}
        label={t("appointments.grid.validity.period.start")}
        value={inputs.validityPeriod.start}
        onChange={handleStartDateChange}
        shouldDisableDate={shouldDisableStartDate}
        slotProps={{
          day: { sx: { fontSize: "1.2rem" } },
        }}
      />
      <RemoveIcon />
      <DatePicker
        sx={datePickerStyle}
        label={t("appointments.grid.validity.period.end")}
        value={inputs.validityPeriod.end}
        onChange={handleEndDateChange}
        minDate={startDate}
        shouldDisableDate={shouldDisableEndDate}
        slotProps={{
          day: { sx: { fontSize: "1.2rem" } },
        }}
      />
    </Box>
  );
};
