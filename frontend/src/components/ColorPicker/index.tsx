import { FC, KeyboardEvent, useMemo, useState } from "react";

import { Box, ClickAwayListener } from "@mui/material";
import { CirclePicker, ColorResult } from "react-color";

import { ColorPickerIcon } from "~/components/SVG/ColorPickerIcon";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { circlePickerStyle, PickerBox } from "./style";
import { HexaColor } from "./types";

export const ColorPicker: FC = () => {
  const [isCirclePickerVisible, setIsCirclePickerVisible] = useState(false);

  const {
    inputs,
    updateGridModalInputs: { handleColorChange },
    modalType,
  } = useGridModal();

  const disabled = useMemo(
    () => modalType === GRID_MODAL_TYPE.CONSULTATION,
    [modalType],
  );

  const handlePickerToggle = () => {
    if (disabled) return;
    return setIsCirclePickerVisible((prev) => !prev);
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
      <PickerBox disabled={disabled} tabIndex={0} onKeyDown={handleKeyDown}>
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
      </PickerBox>
    </ClickAwayListener>
  );
};
