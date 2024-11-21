import { USER_STATUS } from "~/providers/FindAppointmentsProvider/enums";
import { UserCardInfos } from "~/providers/FindAppointmentsProvider/types";

export interface UserCardProps {
  infos: UserCardInfos;
}

export interface WrapperUserCardProps {
  status: USER_STATUS;
}

export interface StatusColorProps {
  status: USER_STATUS;
}
