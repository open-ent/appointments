import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import debounce from "lodash/debounce";

import {
  MIN_NB_CHAR_BEFORE_SEARCH_FOR_ADML,
  MIN_USERS_NEEDED,
} from "~/core/constants";
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
  const lastSearchRef = useRef("");
  const [isNewSearch, setIsNewSearch] = useState(false);

  const {
    currentData: newUsers,
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
    if (newUsers && search === lastSearchRef.current) {
      setIsNewSearch(false);
      const hasMore = newUsers.length >= NUMBER_MORE_USERS;
      setHasMoreUsers(hasMore);

      setUsers((prev) => {
        const updatedUsers = page === 1 ? newUsers : [...prev, ...newUsers];

        if (hasMore && updatedUsers.length < MIN_USERS_NEEDED) {
          setPage((p) => p + 1);
        }

        return updatedUsers;
      });
    }
  }, [newUsers, search, page]);

  const loadMoreUsers = useCallback(() => {
    if (!isFetching && hasMoreUsers) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMoreUsers]);

  const refreshSearch = useCallback(() => {
    setPage(1);
    setUsers([]);
    setHasMoreUsers(true);
  }, []);

  const handleSearch = useCallback(
    debounce((newSearch: string) => {
      lastSearchRef.current = newSearch;
      setPage(1);
      setUsers([]);
      setHasMoreUsers(true);
      setIsNewSearch(true);
      setSearch(newSearch);
    }, 300),
    [],
  );

  const resetSearch = useCallback(() => {
    handleSearch("");
  }, [handleSearch]);

  const refetchSearch = useCallback(async () => {
    setPage(1);
    setUsers([]);
    setHasMoreUsers(true);
    await refetch();
  }, [refetch]);

  const value = useMemo<FindAppointmentsProviderContextProps>(
    () => ({
      users,
      hasMoreUsers,
      search,
      isFetching,
      isNewSearch,
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
      isNewSearch,
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
