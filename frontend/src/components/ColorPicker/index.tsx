import { FC, useState } from "react";

import { Box, ClickAwayListener } from "@mui/material";
import { CirclePicker, ColorResult } from "react-color";

import { circlePickerStyle, colorPickerIconStyle } from "./style";
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

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={colorPickerIconStyle}>
        <ColorPickerIcon onClick={handlePickerToggle} fill={inputs.color} />
        <Box sx={circlePickerStyle}>
          {isCirclePickerVisible && (
            <CirclePicker
              color={inputs.color}
              onChange={(newColor: ColorResult) => {
                handleColorChange(newColor.hex);
                handleClose();
              }}
              circleSize={20}
              circleSpacing={5}
              width="16rem"
            />
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};
