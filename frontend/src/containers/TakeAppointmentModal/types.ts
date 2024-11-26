import { MODAL_SIZE } from "./enum";
import { UserCardInfos } from "~/providers/FindAppointmentsProvider/types";

export interface TakeAppointmentModalProps {
  userInfos: UserCardInfos;
}

export interface ContentWrapperProps {
  modalSize: MODAL_SIZE;
}
