import { createContext, FC, useContext, useMemo, useState } from "react";

import {
  FindAppointmentsProviderContextProps,
  FindAppointmentsProviderProps,
  UserCardInfos,
} from "./types";
import { initialUsers, mock, NUMBER_MORE_USERS } from "./utils";

const FindAppointmentsProviderContext =
  createContext<FindAppointmentsProviderContextProps | null>(null);

export const useFindAppointmentsProvider = () => {
  const context = useContext(FindAppointmentsProviderContext);
  if (!context) {
    throw new Error(
      "useFindAppointmentsProvider must be used within a FindAppointmentsProvider",
    );
  }
  return context;
};

export const FindAppointmentsProvider: FC<FindAppointmentsProviderProps> = ({
  children,
}) => {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<UserCardInfos | null>(null);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMoreUsers = () => {
    setUsers((prev) => {
      const newUsers = mock.slice(prev.length, prev.length + NUMBER_MORE_USERS);
      if (newUsers.length < NUMBER_MORE_USERS) {
        setHasMoreUsers(false);
      }
      return [...prev, ...newUsers];
    });
  };

  const handleOnClickCard = (user: UserCardInfos | null) => {
    setSelectedUser(user);
    if (user) setIsModalOpen(true);
  };

  const value = useMemo<FindAppointmentsProviderContextProps>(
    () => ({
      users,
      selectedUser,
      hasMoreUsers,
      isModalOpen,
      setIsModalOpen,
      loadMoreUsers,
      handleOnClickCard,
    }),
    [users, hasMoreUsers, isModalOpen, selectedUser],
  );
  return (
    <FindAppointmentsProviderContext.Provider value={value}>
      {children}
    </FindAppointmentsProviderContext.Provider>
  );
};
