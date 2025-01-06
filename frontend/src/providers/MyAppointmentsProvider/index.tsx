import { createContext, FC, useContext, useMemo, useState } from "react";

import { MY_APPOINTMENTS_LIST_STATE } from "./enum";
import {
  AppointmentListInfoType,
  MyAppointmentsProviderContextProps,
  MyAppointmentsProviderProps,
} from "./types";
import { initialLimits, initialPages, states } from "./utils";
import {
  useAcceptAppointmentMutation,
  useCancelAppointmentMutation,
  useGetAppointmentQuery,
  useGetMyAppointmentsQuery,
  useRejectAppointmentMutation,
} from "~/services/api/AppointmentService";

const MyAppointmentsProviderContext =
  createContext<MyAppointmentsProviderContextProps | null>(null);

export const useMyAppointments = () => {
  const context = useContext(MyAppointmentsProviderContext);
  if (!context) {
    throw new Error(
      "useMyAppointments must be used within a MyAppointmentsProvider",
    );
  }
  return context;
};

export const MyAppointmentsProvider: FC<MyAppointmentsProviderProps> = ({
  children,
}) => {
  const [pages, setPages] = useState<AppointmentListInfoType>(initialPages);
  const [limits, setLimits] = useState<AppointmentListInfoType>(initialLimits);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const { data: myPendingAppointments } = useGetMyAppointmentsQuery({
    states: states[MY_APPOINTMENTS_LIST_STATE.PENDING],
    page: pages[MY_APPOINTMENTS_LIST_STATE.PENDING],
    limit: limits[MY_APPOINTMENTS_LIST_STATE.PENDING],
  });

  const { data: myAcceptedAppointments } = useGetMyAppointmentsQuery({
    states: states[MY_APPOINTMENTS_LIST_STATE.ACCEPTED],
    page: pages[MY_APPOINTMENTS_LIST_STATE.ACCEPTED],
    limit: limits[MY_APPOINTMENTS_LIST_STATE.ACCEPTED],
  });

  const { data: myRejectedOrCanceledAppointments } = useGetMyAppointmentsQuery({
    states: states[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED],
    page: pages[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED],
    limit: limits[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED],
  });

  const { data: selectedAppointment } = useGetAppointmentQuery(
    selectedAppointmentId as number,
    { skip: !selectedAppointmentId },
  );

  const [acceptAppointment] = useAcceptAppointmentMutation();
  const [rejectAppointment] = useRejectAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  const handleChangePage = (
    state: MY_APPOINTMENTS_LIST_STATE,
    page: number,
  ) => {
    setPages((prev) => ({ ...prev, [state]: page }));
  };

  const handleChangeLimit = (
    state: MY_APPOINTMENTS_LIST_STATE,
    limit: number,
  ) => {
    setLimits((prev) => ({ ...prev, [state]: limit }));
  };

  const handleAcceptAppointment = async (id: number) => {
    try {
      await acceptAppointment(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectAppointment = async (id: number) => {
    try {
      await rejectAppointment(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      await cancelAppointment(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickAppointment = (id: number) => {
    setSelectedAppointmentId(id);
    setIsAppointmentModalOpen(true);
  };

  const handleCloseAppointmentModal = () => {
    setSelectedAppointmentId(null);
    setIsAppointmentModalOpen(false);
  };

  const value = useMemo<MyAppointmentsProviderContextProps>(
    () => ({
      myPendingAppointments,
      myAcceptedAppointments,
      myRejectedOrCanceledAppointments,
      isAppointmentModalOpen,
      selectedAppointment,
      handleChangePage,
      handleChangeLimit,
      handleAcceptAppointment,
      handleRejectAppointment,
      handleCancelAppointment,
      handleClickAppointment,
      handleCloseAppointmentModal,
    }),
    [
      myPendingAppointments,
      myAcceptedAppointments,
      myRejectedOrCanceledAppointments,
      isAppointmentModalOpen,
      selectedAppointment,
      pages,
      limits,
    ],
  );

  return (
    <MyAppointmentsProviderContext.Provider value={value}>
      {children}
    </MyAppointmentsProviderContext.Provider>
  );
};
