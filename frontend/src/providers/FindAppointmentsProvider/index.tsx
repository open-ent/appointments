import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FindAppointmentsProviderContextProps,
  FindAppointmentsProviderProps,
} from "./types";
import { NUMBER_MORE_USERS } from "./utils";
import { useGetCommunicationUsersQuery } from "~/services/api/CommunicationService";
import { UserCardInfos } from "~/services/api/CommunicationService/types";

const FindAppointmentsProviderContext =
  createContext<FindAppointmentsProviderContextProps | null>(null);

export const useFindAppointments = () => {
  const context = useContext(FindAppointmentsProviderContext);
  if (!context) {
    throw new Error(
      "useFindAppointments must be used within a FindAppointmentsProvider",
    );
  }
  return context;
};

export const FindAppointmentsProvider: FC<FindAppointmentsProviderProps> = ({
  children,
}) => {
  const [users, setUsers] = useState<UserCardInfos[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const {
    data: newUsers,
    isFetching,
    refetch,
  } = useGetCommunicationUsersQuery(
    {
      search,
      page,
      limit: NUMBER_MORE_USERS,
    },
    { skip: !search },
  );

  useEffect(() => {
    setUsersFromNewUsers(newUsers);
  }, [newUsers]);

  const setUsersFromNewUsers = (newUsers: UserCardInfos[] | undefined) => {
    if (newUsers) setUsers((prev) => [...prev, ...newUsers]);
    if (newUsers && newUsers.length < NUMBER_MORE_USERS) {
      setHasMoreUsers(false);
    } else {
      setHasMoreUsers(true);
    }
  };

  const loadMoreUsers = () => {
    !isFetching && setPage((prev) => prev + 1);
  };

  const handleSearch = (newSearch: string) => {
    refreshSearch();
    setSearch(newSearch);
  };

  const resetSearch = () => {
    handleSearch("");
  };

  const refreshSearch = () => {
    setPage(1);
    setUsers([]);
    setHasMoreUsers(true);
  };

  const refetchSearch = async () => {
    refreshSearch();
    const oldNewUsers = newUsers;
    const { data } = await refetch();
    if (oldNewUsers === data) setUsersFromNewUsers(data);
  };

  const value = useMemo<FindAppointmentsProviderContextProps>(
    () => ({
      users,
      hasMoreUsers,
      search,
      isFetching,
      loadMoreUsers,
      handleSearch,
      refreshSearch,
      resetSearch,
      refetchSearch,
    }),
    [users, hasMoreUsers, search, newUsers, page, isFetching],
  );
  return (
    <FindAppointmentsProviderContext.Provider value={value}>
      {children}
    </FindAppointmentsProviderContext.Provider>
  );
};
