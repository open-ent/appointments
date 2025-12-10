import { FC, useEffect, useMemo } from "react";

import { Box } from "@cgi-learning-hub/ui";
import RemoveIcon from "@mui/icons-material/Remove";
import { DatePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS } from "~/core/constants";
import { YEAR } from "~/core/dayjs.const";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { boxStyle, datePickerStyle, removeIconStyle } from "./style";

export const RangeDatePicker: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);

  const {
    inputs: {
      validityPeriod: { start: startDate, end: endDate },
    },
    errorInputs: { validityPeriod: validityPeriodError },
    updateGridModalInputs: { handleStartDateChange, handleEndDateChange },
    modalType,
    isSubmitButtonLoading,
  } = useGridModal();

  const isStartError = !!validityPeriodError && !startDate;
  const isEndError = !!validityPeriodError && !endDate;

  const disabled = useMemo(
    () => isSubmitButtonLoading || modalType !== GRID_MODAL_TYPE.CREATION,
    [isSubmitButtonLoading, modalType],
  );

  useEffect(() => {
    if (startDate?.add(1, YEAR).isBefore(endDate)) {
      handleEndDateChange(null);
    }
  }, [endDate, handleEndDateChange, startDate]);

  return (
    <Box sx={boxStyle}>
      <Box sx={datePickerStyle}>
        <DatePicker
          label={t("appointments.grid.validity.period.start")}
          value={startDate}
          onChange={handleStartDateChange}
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
          maxDate={startDate?.add(1, YEAR)}
          disabled={disabled || !startDate}
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
