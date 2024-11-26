import { USER_STATUS } from "~/providers/FindAppointmentsProvider/enums";
import { UserCardInfos } from "~/providers/FindAppointmentsProvider/types";

export interface TakeAppointmentGridInfosProps {
  userInfos: UserCardInfos;
}

export interface StatusCircleProps {
  status: USER_STATUS;
}
