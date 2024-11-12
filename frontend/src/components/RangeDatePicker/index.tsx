import { FC } from "react";

import RemoveIcon from "@mui/icons-material/Remove";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";

import { boxStyle, datePickerStyle, removeIconStyle } from "./style";
import { shouldDisableEndDate, shouldDisableStartDate } from "./utils";
import { useGridModalProvider } from "~/providers/GridModalProvider";

export const RangeDatePicker: FC = () => {
  const { t } = useTranslation("appointments");

  const {
    inputs: {
      validityPeriod: { start: startDate, end: endDate },
    },
    errorInputs: { validityPeriod: validityPeriodError },
    updateGridModalInputs: { handleStartDateChange, handleEndDateChange },
  } = useGridModalProvider();

  const isStartError = !!validityPeriodError && !startDate;
  const isEndError = !!validityPeriodError && !endDate;

  return (
    <Box sx={boxStyle}>
      <DatePicker
        sx={datePickerStyle}
        label={t("appointments.grid.validity.period.start")}
        value={startDate}
        onChange={handleStartDateChange}
        shouldDisableDate={shouldDisableStartDate}
        slotProps={{
          day: { sx: { fontSize: "1.2rem" } },
          textField: {
            inputProps: {
              readOnly: true,
            },
            error: isStartError,
            helperText: isStartError && t(validityPeriodError),
          },
        }}
      />
      <RemoveIcon sx={removeIconStyle} />
      <DatePicker
        sx={datePickerStyle}
        label={t("appointments.grid.validity.period.end")}
        value={endDate}
        onChange={handleEndDateChange}
        minDate={startDate}
        shouldDisableDate={shouldDisableEndDate}
        slotProps={{
          day: { sx: { fontSize: "1.2rem" } },
          textField: {
            inputProps: {
              readOnly: true,
            },
            error: isEndError,
            helperText: isEndError && t(validityPeriodError),
          },
        }}
      />
    </Box>
  );
};
