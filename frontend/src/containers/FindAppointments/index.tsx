import { FC, useCallback, useEffect, useRef } from "react";

import { Box, Loader, SearchInput, Typography } from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";

import { FindAppointmentsEmptyState } from "~/components/SVG/FindAppointmentsEmptyState";
import { UserCard } from "~/components/UserCard";
import {
  APPOINTMENTS,
  MIN_NB_CHAR_BEFORE_SEARCH_FOR_ADML,
} from "~/core/constants";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
import { useFindAppointments } from "~/providers/FindAppointmentsProvider";
import { useGlobal } from "~/providers/GlobalProvider";
import { BookAppointmentModal } from "../BookAppointmentModal";
import {
  containerStyle,
  emptyStateBoxStyle,
  emptyStateSVGStyle,
  emptyStateTextStyle,
  listCardStyle,
  searchInputStyle,
} from "./style";

export const FindAppointments: FC = () => {
  const {
    users,
    hasNextPage,
    search,
    inputValue,
    isFetchingFirstPage,
    isFetchingNextPage,
    loadMoreUsers,
    handleSearchChange,
  } = useFindAppointments();
  const { selectedUser, handleOnClickCard } = useBookAppointmentModal();
  const { t } = useTranslation(APPOINTMENTS);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { isConnectedUserADML, gridIdFromLink } = useGlobal();

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMoreUsers();
      }
    },
    [hasNextPage, loadMoreUsers],
  );

  // Infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    const lastUser = targetRef.current;
    if (lastUser) {
      observerRef.current.observe(lastUser);
    }

    return () => {
      if (observerRef.current && lastUser) {
        observerRef.current.unobserve(lastUser);
      }
    };
  }, [users, handleObserver]);

  useEffect(() => {
    if (!gridIdFromLink || !users) return;
    handleOnClickCard(users[0]); // We only have cards of same user so first one is ok
  }, [users, gridIdFromLink, handleOnClickCard])

  return (
    <>
      {selectedUser && <BookAppointmentModal userInfos={selectedUser} />}
      <Box sx={containerStyle}>
        <SearchInput
          sx={searchInputStyle}
          onChange={(event) => handleSearchChange(event.target.value)}
          value={inputValue}
        />
        {!users.length && !isFetchingFirstPage && (
          <Box sx={emptyStateBoxStyle}>
            <Typography variant="body1" sx={emptyStateTextStyle}>
              {!search ||
              (isConnectedUserADML &&
                search.length < MIN_NB_CHAR_BEFORE_SEARCH_FOR_ADML)
                ? t("appointments.find.empty.state.search.bar")
                : t("appointments.find.empty.state.no.user")}
            </Typography>
            <Box sx={emptyStateSVGStyle}>
              <FindAppointmentsEmptyState />
            </Box>
          </Box>
        )}
        {isFetchingFirstPage ? (
          <Loader />
        ) : (
          <>
            <Box sx={listCardStyle}>
              {users.map((user) => (
                <UserCard key={user.userId} infos={user} />
              ))}
            </Box>
            <Box ref={targetRef}></Box>
            {isFetchingNextPage && <Loader />}
          </>
        )}
      </Box>
    </>
  );
};
