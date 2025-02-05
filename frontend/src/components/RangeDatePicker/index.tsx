import { FC, useMemo } from "react";

import RemoveIcon from "@mui/icons-material/Remove";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS } from "~/core/constants";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { boxStyle, datePickerStyle, removeIconStyle } from "./style";
import { shouldDisableEndDate, shouldDisableStartDate } from "./utils";

export const RangeDatePicker: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);

  const {
    inputs: {
      validityPeriod: { start: startDate, end: endDate },
    },
    errorInputs: { validityPeriod: validityPeriodError },
    updateGridModalInputs: { handleStartDateChange, handleEndDateChange },
    modalType,
  } = useGridModal();

  const isStartError = !!validityPeriodError && !startDate;
  const isEndError = !!validityPeriodError && !endDate;

  const disabled = useMemo(
    () => modalType !== GRID_MODAL_TYPE.CREATION,
    [modalType],
  );

  return (
    <Box sx={boxStyle}>
      <Box sx={datePickerStyle}>
        <DatePicker
          label={t("appointments.grid.validity.period.start")}
          value={startDate}
          onChange={handleStartDateChange}
          shouldDisableDate={shouldDisableStartDate}
          disabled={disabled}
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
      </Box>
      <RemoveIcon sx={removeIconStyle} />
      <Box sx={datePickerStyle}>
        <DatePicker
          label={t("appointments.grid.validity.period.end")}
          value={endDate}
          onChange={handleEndDateChange}
          minDate={startDate}
          shouldDisableDate={shouldDisableEndDate}
          disabled={disabled}
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
    </Box>
  );
};
