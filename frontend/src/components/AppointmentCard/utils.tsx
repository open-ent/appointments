import { FC } from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { iconsStyle } from "./style";
import { AppointmentStateIconProps } from "./types";
import { APPOINTMENT_STATE_VALUES } from "~/core/constants";
import { APPOINTMENT_STATE } from "~/core/enums";

export const AppointmentStateIcon: FC<AppointmentStateIconProps> = ({
  state,
  isRequester,
}) => {
  switch (state) {
    case APPOINTMENT_STATE.CREATED:
      return isRequester ? (
        <HelpIcon
          sx={iconsStyle}
          color={APPOINTMENT_STATE_VALUES[state].color}
        />
      ) : (
        <ErrorIcon
          sx={iconsStyle}
          color={APPOINTMENT_STATE_VALUES[state].color}
        />
      );
    case APPOINTMENT_STATE.ACCEPTED:
      return (
        <CheckCircleIcon
          sx={iconsStyle}
          color={APPOINTMENT_STATE_VALUES[state].color}
        />
      );
    case APPOINTMENT_STATE.REFUSED:
      return (
        <RemoveCircleIcon
          sx={iconsStyle}
          color={APPOINTMENT_STATE_VALUES[state].color}
        />
      );
    case APPOINTMENT_STATE.CANCELED:
      return (
        <CancelIcon
          sx={iconsStyle}
          color={APPOINTMENT_STATE_VALUES[state].color}
        />
      );
  }
};
