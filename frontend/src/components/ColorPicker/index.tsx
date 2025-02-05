import { FC, KeyboardEvent, useState } from "react";

import { Box, ClickAwayListener } from "@mui/material";
import { CirclePicker, ColorResult } from "react-color";

import { ColorPickerIcon } from "~/components/SVG/ColorPickerIcon";
import { useGridModal } from "~/providers/GridModalProvider";
import { circlePickerStyle, colorPickerIconStyle } from "./style";
import { HexaColor } from "./types";

export const ColorPicker: FC = () => {
  const [isCirclePickerVisible, setIsCirclePickerVisible] = useState(false);

  const {
    inputs,
    updateGridModalInputs: { handleColorChange },
  } = useGridModal();

  const handlePickerToggle = () => {
    setIsCirclePickerVisible((prev) => !prev);
  };

  const handleClose = () => {
    setIsCirclePickerVisible(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePickerToggle();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={colorPickerIconStyle} tabIndex={0} onKeyDown={handleKeyDown}>
        <ColorPickerIcon onClick={handlePickerToggle} fill={inputs.color} />
        {isCirclePickerVisible && (
          <Box sx={circlePickerStyle}>
            <CirclePicker
              color={inputs.color}
              onChange={(newColor: ColorResult) => {
                handleColorChange(newColor.hex as HexaColor);
                handleClose();
              }}
              circleSize={20}
              circleSpacing={5}
              width="15rem"
            />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};
