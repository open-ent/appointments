import { FC, useCallback, useEffect, useRef } from "react";

import { SearchInput } from "@cgi-learning-hub/ui";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  containerStyle,
  emptyStateBoxStyle,
  emptyStateSVGStyle,
  emptyStateTextStyle,
  listCardStyle,
  searchInputStyle,
} from "./style";
import { BookAppointmentModal } from "../BookAppointmentModal";
import { FindAppointmentsEmptyState } from "~/components/SVG/FindAppointmentsEmptyState";
import { UserCard } from "~/components/UserCard";
import { useBookAppointmentModal } from "~/providers/BookAppointmentModalProvider";
import { useFindAppointments } from "~/providers/FindAppointmentsProvider";
import { NUMBER_MORE_USERS } from "~/providers/FindAppointmentsProvider/utils";

export const FindAppointments: FC = () => {
  const { users, hasMoreUsers, search, loadMoreUsers, handleSearch } =
    useFindAppointments();
  const { selectedUser } = useBookAppointmentModal();
  const { t } = useTranslation("appointments");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMoreUsers) {
        loadMoreUsers();
      }
    },
    [hasMoreUsers, loadMoreUsers],
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

  return (
    <>
      {selectedUser && <BookAppointmentModal userInfos={selectedUser} />}
      <Box sx={containerStyle}>
        <SearchInput
          sx={searchInputStyle}
          onChange={(event) => handleSearch(event.target.value)}
        />
        {(!search || !users.length) && (
          <Box sx={emptyStateBoxStyle}>
            <Typography variant="body1" sx={emptyStateTextStyle}>
              {!search
                ? t("appointments.find.empty.state.search.bar")
                : t("appointments.find.empty.state.no.user")}
            </Typography>
            <Box sx={emptyStateSVGStyle}>
              <FindAppointmentsEmptyState />
            </Box>
          </Box>
        )}
        <Box sx={listCardStyle}>
          {users.map((user, index) => (
            <UserCard
              key={user.userId}
              infos={user}
              ref={
                index === users.length - NUMBER_MORE_USERS ? targetRef : null
              }
            />
          ))}
        </Box>
      </Box>
    </>
  );
};
