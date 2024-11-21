import { SLOT_DURATION } from "~/core/enums";
import { USER_STATUS } from "~/providers/FindAppointmentsProvider/enums";
import { UserCardInfos } from "~/providers/FindAppointmentsProvider/types";

export interface TakeAppointmentGridInfosProps {
  userInfos: UserCardInfos;
  gridsName: string[];
  gridInfo: {
    visio: boolean;
    slotDuration: SLOT_DURATION;
    location: string;
    publicComment: string;
  };
}

export interface StatusCircleProps {
  status: USER_STATUS;
}
