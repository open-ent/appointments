import { FC } from "react";

import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@cgi-learning-hub/ui";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import { APPOINTMENTS } from "~/core/constants";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import {
  beginAndEndBoxStyle,
  beginAndEndWrapperStyle,
  boxValueStyle,
  formControlStyle,
  iconButtonStyle,
  iconStyle,
  selectStyle,
  StyledDailySlotBox,
  timeInputStyle,
} from "./style";
import { DailySlotProps } from "./types";
import { getEndOptions, getStartOptions } from "./utils";

export const DailySlot: FC<DailySlotProps> = ({ day, slot }) => {
  const { t } = useTranslation(APPOINTMENTS);
  const {
    inputs: { weekSlots, duration },
    errorInputs: { slots },
    updateGridModalInputs: { handleDeleteSlot, handleSlotChange },
    modalType,
    isSubmitButtonLoading,
  } = useGridModal();

  const isSlotError =
    slots.ids.some((item) => item === slot.id) &&
    (!slot.begin.time || !slot.end.time);

  const isDisabled =
    isSubmitButtonLoading || modalType !== GRID_MODAL_TYPE.CREATION;

  return (
    <StyledDailySlotBox isSlotError={isSlotError}>
      <Box sx={beginAndEndWrapperStyle}>
        <Box sx={beginAndEndBoxStyle}>
          <Typography noWrap>{t("appointments.from") + " :"}</Typography>
          <FormControl variant="filled" sx={formControlStyle}>
            <Select
              onChange={(e) =>
                handleSlotChange(day, slot, e.target.value, "begin")
              }
              disabled={isDisabled}
              sx={selectStyle}
              value={slot.begin.parseToString()}
              renderValue={(value: string) => (
                <Box sx={boxValueStyle}>
                  <AccessTimeIcon sx={iconStyle} />
                  <Typography variant="body2" sx={timeInputStyle}>
                    {value}
                  </Typography>
                </Box>
              )}
            >
              {getStartOptions(weekSlots[day], duration, slot).map((time) => (
                <MenuItem key={uuidv4()} value={time.parseToString()}>
                  {time.parseToString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={beginAndEndBoxStyle}>
          <Typography noWrap>{t("appointments.to") + " :"}</Typography>
          <FormControl variant="filled" sx={formControlStyle}>
            <Select
              onChange={(e) =>
                handleSlotChange(day, slot, e.target.value, "end")
              }
              disabled={isDisabled}
              sx={selectStyle}
              value={slot.end.parseToString()}
              label="test"
              renderValue={(value) => (
                <Box sx={boxValueStyle}>
                  <AccessTimeIcon sx={iconStyle} />
                  <Typography variant="body2" sx={timeInputStyle}>
                    {value}
                  </Typography>
                </Box>
              )}
            >
              {getEndOptions(weekSlots[day], duration, slot).map((time) => (
                <MenuItem key={uuidv4()} value={time.parseToString()}>
                  {time.parseToString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {modalType === GRID_MODAL_TYPE.CREATION && (
        <IconButton
          onClick={() => handleDeleteSlot(day, slot.id)}
          sx={iconButtonStyle}
          disabled={isDisabled}
        >
          <DeleteIcon sx={iconStyle} />
        </IconButton>
      )}
    </StyledDailySlotBox>
  );
};
