import { ReactNode } from "react";

import { UserCardInfos } from "~/services/api/CommunicationService/types";

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
