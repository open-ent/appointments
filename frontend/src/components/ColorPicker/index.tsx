import { FC, useState, KeyboardEvent } from "react";

import { Box, ClickAwayListener } from "@mui/material";
import { CirclePicker, ColorResult } from "react-color";

import { circlePickerStyle, colorPickerIconStyle } from "./style";
import { HexaColor } from "./types";
import { ColorPickerIcon } from "~/components/SVG/ColorPickerIcon";
import { useGridModalProvider } from "~/providers/GridModalProvider";

export const ColorPicker: FC = () => {
  const [isCirclePickerVisible, setIsCirclePickerVisible] = useState(false);

  const {
    inputs,
    updateGridModalInputs: { handleColorChange },
  } = useGridModalProvider();

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
