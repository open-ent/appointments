import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import debounce from "lodash/debounce";

import { MIN_NB_CHAR_BEFORE_SEARCH_FOR_ADML } from "~/core/constants";
import { useGetCommunicationUsersQuery } from "~/services/api/CommunicationService";
import { UserCardInfos } from "~/services/api/CommunicationService/types";
import { useGlobal } from "../GlobalProvider";
import {
  FindAppointmentsProviderContextProps,
  FindAppointmentsProviderProps,
} from "./types";
import { NUMBER_MORE_USERS } from "./utils";

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
  const { isConnectedUserADML } = useGlobal();
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
    {
      skip:
        !search ||
        (isConnectedUserADML &&
          search.length < MIN_NB_CHAR_BEFORE_SEARCH_FOR_ADML),
    },
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

  const loadMoreUsers = useCallback(() => {
    if (!isFetching) setPage((prev) => prev + 1);
  }, [isFetching]);

  const refreshSearch = useCallback(() => {
    setPage(1);
    setUsers([]);
    setHasMoreUsers(true);
  }, []);

  const handleSearch = useCallback(
    debounce((newSearch: string) => {
      refreshSearch();
      setSearch(newSearch);
    }, 300),
    [refreshSearch],
  );

  const resetSearch = useCallback(() => {
    handleSearch("");
  }, [handleSearch]);

  const refetchSearch = useCallback(async () => {
    refreshSearch();
    const oldNewUsers = newUsers;
    const { data } = await refetch();
    if (oldNewUsers === data) setUsersFromNewUsers(data);
  }, [refreshSearch, newUsers, refetch]);

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
    [
      users,
      hasMoreUsers,
      search,
      isFetching,
      loadMoreUsers,
      handleSearch,
      refreshSearch,
      resetSearch,
      refetchSearch,
    ],
  );
  return (
    <FindAppointmentsProviderContext.Provider value={value}>
      {children}
    </FindAppointmentsProviderContext.Provider>
  );
};
