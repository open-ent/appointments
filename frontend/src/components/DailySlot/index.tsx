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
  boxValueStyle,
  formControlStyle,
  iconButtonStyle,
  iconStyle,
  selectStyle,
  StyledDailySlotBox,
  timeInputStyle,
} from "./style";
import { DailySlotProps } from "./types";
import { formatTime, getEndOptions, getStartOptions } from "./utils";
import { useGridModalProvider } from "~/providers/GridModalProvider";

export const DailySlot: FC<DailySlotProps> = ({ day, slot }) => {
  const { t } = useTranslation("appointments");
  const {
    inputs: { weekSlots, slotDuration },
    errorInputs: { slots },
    updateGridModalInputs: { handleDeleteSlot, handleSlotChange },
  } = useGridModalProvider();

  const isSlotError =
    slots.ids.some((item) => item === slot.id) && (!slot.begin || !slot.end);

  return (
    <StyledDailySlotBox isSlotError={isSlotError}>
      <Typography>{t("appointments.from") + " :"}</Typography>
      <FormControl variant="filled" sx={formControlStyle}>
        <Select
          onChange={(e) =>
            handleSlotChange(day, slot.id, e.target.value, "begin")
          }
          sx={selectStyle}
          value={formatTime(slot.begin)}
          renderValue={(value: String) => (
            <Box sx={boxValueStyle}>
              <AccessTimeIcon sx={iconStyle} />
              <Typography sx={timeInputStyle}>{value}</Typography>
            </Box>
          )}
        >
          {getStartOptions(weekSlots[day], slotDuration).map((time) => (
            <MenuItem key={uuidv4()} value={formatTime(time)}>
              {formatTime(time)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography>{t("appointments.to") + " :"}</Typography>
      <FormControl variant="filled" sx={formControlStyle}>
        <Select
          onChange={(e) =>
            handleSlotChange(day, slot.id, e.target.value, "end")
          }
          sx={selectStyle}
          value={formatTime(slot.end)}
          label="test"
          renderValue={(value) => (
            <Box sx={boxValueStyle}>
              <AccessTimeIcon sx={iconStyle} />
              <Typography sx={timeInputStyle}>{value}</Typography>
            </Box>
          )}
        >
          {getEndOptions(weekSlots[day], slotDuration, slot).map((time) => (
            <MenuItem key={uuidv4()} value={formatTime(time)}>
              {formatTime(time)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton
        onClick={() => handleDeleteSlot(day, slot.id)}
        sx={iconButtonStyle}
      >
        <DeleteIcon sx={iconStyle} />
      </IconButton>
    </StyledDailySlotBox>
  );
};
