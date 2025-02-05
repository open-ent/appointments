import { APPOINTMENT_STATE } from "~/core/enums";
import { MyMinimalAppointment } from "~/services/api/AppointmentService/types";

export interface AppointmentCardProps {
  appointment: MyMinimalAppointment;
}

export interface AppointmentStateIconProps {
  state: APPOINTMENT_STATE;
  isRequester: boolean;
}

export interface StyledCardProps {
  isAnimated: boolean;
}
