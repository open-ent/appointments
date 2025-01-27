import { FC } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

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
import { useGridModal } from "~/providers/GridModalProvider";

export const DailySlot: FC<DailySlotProps> = ({ day, slot }) => {
  const { t } = useTranslation("appointments");
  const {
    inputs: { weekSlots, duration },
    errorInputs: { slots },
    updateGridModalInputs: { handleDeleteSlot, handleSlotChange },
  } = useGridModal();

  const isSlotError =
    slots.ids.some((item) => item === slot.id) &&
    (!slot.begin.time || !slot.end.time);

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
              sx={selectStyle}
              value={slot.begin.parseToString()}
              renderValue={(value: string) => (
                <Box sx={boxValueStyle}>
                  <AccessTimeIcon sx={iconStyle} />
                  <Typography sx={timeInputStyle}>{value}</Typography>
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
              sx={selectStyle}
              value={slot.end.parseToString()}
              label="test"
              renderValue={(value) => (
                <Box sx={boxValueStyle}>
                  <AccessTimeIcon sx={iconStyle} />
                  <Typography sx={timeInputStyle}>{value}</Typography>
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
      <IconButton
        onClick={() => handleDeleteSlot(day, slot.id)}
        sx={iconButtonStyle}
      >
        <DeleteIcon sx={iconStyle} />
      </IconButton>
    </StyledDailySlotBox>
  );
};
