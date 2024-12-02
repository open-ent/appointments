import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import { USER_STATUS } from "./enums";

export interface FindAppointmentsProviderContextProps {
  users: UserCardInfos[];
  hasMoreUsers: boolean;
  search: string;
  loadMoreUsers: () => void;
  handleSearch: (newSearch: string) => void;
}

export interface FindAppointmentsProviderProps {
  children: ReactNode;
}

export interface UserCardInfos {
  userId: string;
  picture: string | null;
  displayName: string;
  functions: string;
  lastAppointmentDate: Dayjs | null;
  status: USER_STATUS;
}

export interface GetUsersPayload {
  search: string;
  page: number;
  limit: number;
}
