import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import { USER_STATUS } from "./enums";

export interface FindAppointmentsProviderContextProps {
  users: UserCardInfos[];
  hasMoreUsers: boolean;
  loadMoreUsers: () => void;
}

export interface FindAppointmentsProviderProps {
  children: ReactNode;
}

export interface UserCardInfos {
  userId: string;
  profilePicture: string | null;
  displayName: string;
  profession: string;
  lastAppointment: Dayjs | null;
  status: USER_STATUS;
}
