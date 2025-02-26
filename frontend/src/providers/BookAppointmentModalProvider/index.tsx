import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { APPOINTMENTS } from "~/core/constants";
import { useBookAppointmentMutation } from "~/services/api/AppointmentService";
import { UserCardInfos } from "~/services/api/CommunicationService/types";
import {
  useGetAvailableUserMinimalGridsQuery,
  useGetMinimalGridInfosByIdQuery,
  useGetTimeSlotsByGridIdAndDateQuery,
} from "~/services/api/GridService";
import { useFindAppointments } from "../FindAppointmentsProvider";
import {
  BookAppointmentModalProviderContextProps,
  BookAppointmentModalProviderProps,
  DaySlots,
  GridNameWithId,
} from "./types";
import {
  loadingDaySlots,
  transformStringToDayjs,
  transformTimeSlotsToDaySlots,
} from "./utils";

const BookAppointmentModalProviderContext =
  createContext<BookAppointmentModalProviderContextProps | null>(null);

export const useBookAppointmentModal = () => {
  const context = useContext(BookAppointmentModalProviderContext);
  if (!context) {
    throw new Error(
      "useBookAppointmentModal must be used within a BookAppointmentModalProvider",
    );
  }
  return context;
};

export const BookAppointmentModalProvider: FC<
  BookAppointmentModalProviderProps
> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<UserCardInfos | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<GridNameWithId | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState<Dayjs>(dayjs());
  const [currentSlots, setCurrentSlots] = useState<DaySlots[]>(
    loadingDaySlots(dayjs()),
  );
  const [nextAvailableTimeSlot, setNextAvailableTimeSlot] =
    useState<Dayjs | null>(null);
  const [hasNoSlots, setHasNoSlots] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoCallOptionChecked, setIsVideoCallOptionChecked] =
    useState(false);

  const { t } = useTranslation(APPOINTMENTS);

  const { data: grids } = useGetAvailableUserMinimalGridsQuery(
    selectedUser?.userId ?? "",
    { skip: !selectedUser?.userId },
  );
  const { data: gridInfos } = useGetMinimalGridInfosByIdQuery(
    selectedGrid?.id ?? 0,
    { skip: !selectedGrid },
  );
  const { data: gridTimeSlots, isFetching: isGridTimeSlotsFetching } =
    useGetTimeSlotsByGridIdAndDateQuery(
      {
        gridId: selectedGrid?.id ?? 0,
        beginDate: currentDay.startOf("week").format("YYYY-MM-DD"),
        endDate: currentDay.startOf("week").add(5, "day").format("YYYY-MM-DD"),
      },
      { skip: !selectedGrid },
    );

  const [bookAppointment] = useBookAppointmentMutation();
  const { refetchSearch } = useFindAppointments();

  const handleOnClickCard = (user: UserCardInfos | null) => {
    setSelectedUser(user);
    if (user) setIsModalOpen(true);
  };

  const handleOnClickSlot = (slotId: number) => {
    setSelectedSlotId(slotId);
  };

  const handleNextWeek = () => {
    setCurrentDay((prev) => prev.add(1, "week"));
  };

  const handlePreviousWeek = () => {
    setCurrentDay((prev) => prev.subtract(1, "week"));
  };

  const handleNextTimeSlot = useCallback(() => {
    if (nextAvailableTimeSlot) {
      setCurrentDay(nextAvailableTimeSlot);
    }
  }, [nextAvailableTimeSlot]);

  const handleGridChange = useCallback(
    (gridId: number) => {
      if (!grids) return;
      const newGrid = grids.find((grid) => grid.id === gridId);
      if (!newGrid) return;
      setCanGoNext(true);
      setCanGoPrev(false);
      setSelectedGrid(newGrid);
      setSelectedSlotId(null);
      setCurrentDay(dayjs());
    },
    [grids],
  );

  const handleVideoCallCheckboxChange = () => {
    setIsVideoCallOptionChecked((prev) => !prev);
  };

  const handleCloseModal = useCallback(() => {
    setSelectedUser(null);
    setSelectedGrid(null);
    setSelectedSlotId(null);
    setCurrentDay(dayjs());
    setIsVideoCallOptionChecked(false);
    setIsModalOpen(false);
  }, []);

  const handleSubmitAppointment = useCallback(async () => {
    if (!selectedSlotId) {
      return;
    }
    try {
      const bookAppointmentPayload = gridInfos?.videoCallLink?.length
        ? { timeSlotId: selectedSlotId, isVideoCall: isVideoCallOptionChecked }
        : { timeSlotId: selectedSlotId };

      await bookAppointment(bookAppointmentPayload).unwrap();
      toast.success(t("appointments.book.appointment.success"));
    } catch (error: any) {
      if (error?.status) {
        switch (error.status) {
          case 409:
            toast.error(t("appointments.book.appointment.error.not.available"));
            break;
          case 500:
          default:
            toast.error(t("appointments.book.appointment.internal.error"));
            break;
        }
      }
    }
    handleCloseModal();
    refetchSearch();
  }, [
    selectedSlotId,
    gridInfos?.videoCallLink?.length,
    isVideoCallOptionChecked,
    bookAppointment,
    t,
    handleCloseModal,
    refetchSearch,
  ]);

  useEffect(() => {
    if (gridTimeSlots) {
      setCurrentSlots(transformTimeSlotsToDaySlots(gridTimeSlots, currentDay));
      setNextAvailableTimeSlot(
        gridTimeSlots.nextAvailableTimeSlot
          ? transformStringToDayjs(
              gridTimeSlots.nextAvailableTimeSlot.beginDate,
            )
          : null,
      );

      setHasNoSlots(!gridTimeSlots.timeslots);
      setCanGoNext(
        !!gridTimeSlots.nextAvailableTimeSlot || !!gridTimeSlots.timeslots,
      );
    }
  }, [currentDay, gridTimeSlots]);

  useEffect(() => {
    if (isGridTimeSlotsFetching) {
      setCurrentSlots(loadingDaySlots(currentDay));
    }
  }, [currentDay, isGridTimeSlotsFetching]);

  useEffect(() => {
    if (grids && !selectedGrid) {
      setSelectedGrid(grids[0]);
    }
  }, [grids, selectedGrid]);

  useEffect(() => {
    if (currentDay.isSame(dayjs(), "week")) {
      setCanGoPrev(false);
    } else {
      setCanGoPrev(true);
    }
  }, [currentDay]);

  const value = useMemo<BookAppointmentModalProviderContextProps>(
    () => ({
      selectedUser,
      isModalOpen,
      grids,
      gridInfos,
      currentSlots,
      selectedGrid,
      selectedSlotId,
      canGoNext,
      canGoPrev,
      hasNoSlots,
      nextAvailableTimeSlot,
      isGridTimeSlotsFetching,
      isVideoCallOptionChecked,
      handleGridChange,
      handleOnClickSlot,
      handleNextWeek,
      handlePreviousWeek,
      handleNextTimeSlot,
      handleCloseModal,
      handleOnClickCard,
      handleSubmitAppointment,
      handleVideoCallCheckboxChange,
    }),
    [
      selectedUser,
      isModalOpen,
      grids,
      gridInfos,
      currentSlots,
      selectedGrid,
      selectedSlotId,
      canGoNext,
      canGoPrev,
      hasNoSlots,
      nextAvailableTimeSlot,
      isGridTimeSlotsFetching,
      isVideoCallOptionChecked,
      handleGridChange,
      handleNextTimeSlot,
      handleCloseModal,
      handleSubmitAppointment,
    ],
  );
  return (
    <BookAppointmentModalProviderContext.Provider value={value}>
      {children}
    </BookAppointmentModalProviderContext.Provider>
  );
};
