import { ReactNode } from "react";

import { UserCardInfos } from "~/services/api/CommunicationService/types";

export interface FindAppointmentsProviderContextProps {
  users: UserCardInfos[];
  hasMoreUsers: boolean;
  search: string;
  isFetching: boolean;
  loadMoreUsers: () => void;
  handleSearch: (newSearch: string) => void;
  refreshSearch: () => void;
  resetSearch: () => void;
  refetchSearch: () => void;
}

export interface FindAppointmentsProviderProps {
  children: ReactNode;
}
