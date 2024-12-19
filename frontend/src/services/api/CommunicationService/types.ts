import { Dayjs } from "dayjs";

export interface Group {
  id: string;
  name: string;
}

export interface Public {
  groupId: string;
  groupName: string;
}

export interface UserCardInfos {
  userId: string;
  picture: string | null;
  displayName: string;
  functions: string[];
  lastAppointmentDate: Dayjs | null;
  isAvailable: boolean;
}

export interface GetUsersPayload {
  search: string;
  page: number;
  limit: number;
}
