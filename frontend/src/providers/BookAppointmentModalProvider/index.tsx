import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import dayjs, { Dayjs } from "dayjs";

import {
  Alert,
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
import { useFindAppointments } from "../FindAppointmentsProvider";
import { ALERT } from "~/core/enums";
import { useBookAppointmentMutation } from "~/services/api/AppointmentService";
import { UserCardInfos } from "~/services/api/CommunicationService/types";
import {
  useGetAvailableUserMinimalGridsQuery,
  useGetMinimalGridInfosByIdQuery,
  useGetTimeSlotsByGridIdAndDateQuery,
} from "~/services/api/GridService";

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
  const [currentDay, setCurrentDay] = useState<Dayjs>(dayjs().locale("fr"));
  const [currentSlots, setCurrentSlots] = useState<DaySlots[]>(
    loadingDaySlots(dayjs().locale("fr")),
  );
  const [nextAvailableTimeSlot, setNextAvailableTimeSlot] =
    useState<Dayjs | null>(null);
  const [hasNoSlots, setHasNoSlots] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoCallOptionChecked, setIsVideoCallOptionChecked] =
    useState(false);

  const [alert, setAlert] = useState<Alert>({
    isOpen: false,
    alert: ALERT.BOOK_APPOINTMENT_SUCCESS,
  });

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
  const { refreshSearch } = useFindAppointments();

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

  const handleNextTimeSlot = () => {
    if (nextAvailableTimeSlot) {
      setCurrentDay(nextAvailableTimeSlot);
    }
  };

  const handleGridChange = (gridName: string) => {
    if (!grids) return;
    const newGrid = grids.find((grid) => grid.name === gridName);
    if (!newGrid) return;
    setCanGoNext(true);
    setCanGoPrev(false);
    setSelectedGrid(newGrid);
    setSelectedSlotId(null);
    setCurrentDay(dayjs().locale("fr"));
  };

  const handleVideoCallCheckboxChange = () => {
    setIsVideoCallOptionChecked((prev) => !prev);
  };

  const handleSubmitAppointment = async () => {
    if (!selectedSlotId) return;
    try {
      const bookAppointmentPayload = gridInfos?.videoCallLink.length
        ? { timeSlotId: selectedSlotId, isVideoCall: isVideoCallOptionChecked }
        : { timeSlotId: selectedSlotId };

      await bookAppointment(bookAppointmentPayload).unwrap();
      setAlert({
        isOpen: true,
        alert: ALERT.BOOK_APPOINTMENT_SUCCESS,
      });
    } catch (error: any) {
      if (error && error.status) {
        if (error.status === 409) {
          setAlert({
            isOpen: true,
            alert: ALERT.BOOK_APPOINTMENT_UNAVAILABLE_ERROR,
          });
        }
        if (error.status === 500) {
          setAlert({
            isOpen: true,
            alert: ALERT.BOOK_APPOINTMENT_INTERNAL_ERROR,
          });
        }
      }
    }
    setIsModalOpen(false);
    refreshSearch();
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

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
  }, [gridTimeSlots]);

  useEffect(() => {
    if (isGridTimeSlotsFetching) {
      setCurrentSlots(loadingDaySlots(currentDay));
    }
  }, [isGridTimeSlotsFetching]);

  useEffect(() => {
    if (grids && !selectedGrid) {
      setSelectedGrid(grids[0]);
    }
  }, [grids]);

  useEffect(() => {
    if (currentDay.isSame(dayjs().locale("fr"), "week")) {
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
      alert,
      handleGridChange,
      handleOnClickSlot,
      handleNextWeek,
      handlePreviousWeek,
      handleNextTimeSlot,
      setIsModalOpen,
      handleOnClickCard,
      handleSubmitAppointment,
      handleVideoCallCheckboxChange,
      handleCloseAlert,
    }),
    [
      isModalOpen,
      selectedUser,
      grids,
      selectedGrid,
      gridInfos,
      currentSlots,
      currentDay,
      selectedSlotId,
      canGoNext,
      canGoPrev,
      hasNoSlots,
      nextAvailableTimeSlot,
      isGridTimeSlotsFetching,
      isVideoCallOptionChecked,
      alert,
    ],
  );
  return (
    <BookAppointmentModalProviderContext.Provider value={value}>
      {children}
    </BookAppointmentModalProviderContext.Provider>
  );
};
