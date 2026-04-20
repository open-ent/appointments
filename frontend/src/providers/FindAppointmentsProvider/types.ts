import { ReactNode } from "react";

import { UserCardInfos } from "~/services/api/CommunicationService/types";

export interface FindAppointmentsProviderContextProps {
  users: UserCardInfos[];
  hasNextPage: boolean;
  search: string;
  inputValue: string;
  isFetchingFirstPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreUsers: () => void;
  handleSearchChange: (newSearch: string) => void;
  resetSearch: () => void;
  refetchSearch: () => void;
}

export interface FindAppointmentsProviderProps {
  children: ReactNode;
}
