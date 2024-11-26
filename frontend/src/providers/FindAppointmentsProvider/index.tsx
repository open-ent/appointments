import { createContext, FC, useContext, useMemo, useState } from "react";

import {
  FindAppointmentsProviderContextProps,
  FindAppointmentsProviderProps,
} from "./types";
import { initialUsers, mock, NUMBER_MORE_USERS } from "./utils";

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
  const [users, setUsers] = useState(initialUsers);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const loadMoreUsers = () => {
    setUsers((prev) => {
      const newUsers = mock.slice(prev.length, prev.length + NUMBER_MORE_USERS);
      if (newUsers.length < NUMBER_MORE_USERS) {
        setHasMoreUsers(false);
      }
      return [...prev, ...newUsers];
    });
  };

  const value = useMemo<FindAppointmentsProviderContextProps>(
    () => ({
      users,
      hasMoreUsers,
      loadMoreUsers,
    }),
    [users, hasMoreUsers],
  );
  return (
    <FindAppointmentsProviderContext.Provider value={value}>
      {children}
    </FindAppointmentsProviderContext.Provider>
  );
};
