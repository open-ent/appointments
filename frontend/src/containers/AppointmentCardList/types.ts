import { MY_APPOINTMENTS_LIST_STATE } from "~/providers/MyAppointmentsProvider/enum";
import { MyAppointments } from "~/services/api/AppointmentService/types";

export interface AppointmentCardListProps {
  appointmentsType: MY_APPOINTMENTS_LIST_STATE;
  myAppointments: MyAppointments;
}
