import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import debounce from "lodash/debounce";

import { MIN_NB_CHAR_BEFORE_SEARCH_FOR_ADML } from "~/core/constants";
import { useGetCommunicationUsersInfiniteQuery } from "~/services/api/CommunicationService";
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
  const { isConnectedUserADML } = useGlobal();
  const [search, setSearch] = useState("");

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGetCommunicationUsersInfiniteQuery(
    {
      search,
      limit: NUMBER_MORE_USERS,
    },
    {
      skip:
        !search ||
        (isConnectedUserADML &&
          search.length < MIN_NB_CHAR_BEFORE_SEARCH_FOR_ADML),
    },
  );

  const isFetchingFirstPage = isFetching && !isFetchingNextPage;

  const users = useMemo(() => {
    if (
      !search ||
      (isConnectedUserADML &&
        search.length < MIN_NB_CHAR_BEFORE_SEARCH_FOR_ADML)
    )
      return [];
    return data?.pages.flat() ?? [];
  }, [data, isConnectedUserADML, search]);

  const loadMoreUsers = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 300),
    [],
  );

  const resetSearch = useCallback(() => {
    setSearch("");
  }, []);

  const refetchSearch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const value = useMemo<FindAppointmentsProviderContextProps>(
    () => ({
      users,
      hasNextPage,
      search,
      isFetchingFirstPage,
      isFetchingNextPage,
      loadMoreUsers,
      handleSearch,
      resetSearch,
      refetchSearch,
    }),
    [
      users,
      hasNextPage,
      search,
      isFetchingFirstPage,
      isFetchingNextPage,
      loadMoreUsers,
      handleSearch,
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
