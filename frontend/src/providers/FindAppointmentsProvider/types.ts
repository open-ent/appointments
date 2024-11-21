import { Dispatch, ReactNode, SetStateAction } from "react";

import { Dayjs } from "dayjs";

import { USER_STATUS } from "./enums";

export interface FindAppointmentsProviderContextProps {
  users: UserCardInfos[];
  selectedUser: UserCardInfos | null;
  hasMoreUsers: boolean;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  loadMoreUsers: () => void;
  handleOnClickCard: (user: UserCardInfos | null) => void;
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
