import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { MY_APPOINTMENTS_LIST_STATE } from "./enum";
import {
  AppointmentListInfoType,
  AppointmentsType,
  MyAppointmentsProviderContextProps,
  MyAppointmentsProviderProps,
} from "./types";
import {
  initialAppointments,
  initialDialogModalProps,
  initialLimits,
  initialPages,
  states,
} from "./utils";
import { DialogModalProps } from "~/components/DialogModal/types";
import { CONFIRM_MODAL_VALUES } from "~/core/constants";
import { APPOINTMENT_STATE, CONFIRM_MODAL_TYPE } from "~/core/enums";
import {
  useAcceptAppointmentMutation,
  useCancelAppointmentMutation,
  useGetAppointmentQuery,
  useGetAppointmentsDatesQuery,
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
  const { t } = useTranslation("appointments");
  const [pages, setPages] = useState<AppointmentListInfoType>(initialPages);
  const [limits, setLimits] = useState<AppointmentListInfoType>(initialLimits);
  const [myAppointments, setMyAppointments] =
    useState<AppointmentsType>(initialAppointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [dialogModalProps, setDialogModalProps] = useState<DialogModalProps>(
    initialDialogModalProps,
  );

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

  const { data: myAppointmentsDates } = useGetAppointmentsDatesQuery({
    states: [APPOINTMENT_STATE.ACCEPTED],
  });

  const [acceptAppointment] = useAcceptAppointmentMutation();
  const [rejectAppointment] = useRejectAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  const handleChangePage = useCallback(
    (state: MY_APPOINTMENTS_LIST_STATE, page: number) => {
      setPages((prev) => ({ ...prev, [state]: page }));
    },
    [],
  );

  const handleChangeLimit = useCallback(
    (state: MY_APPOINTMENTS_LIST_STATE, limit: number) => {
      setLimits((prev) => ({ ...prev, [state]: limit }));
    },
    [],
  );

  const handleAcceptAppointment = useCallback(
    async (id: number) => {
      try {
        await acceptAppointment(id).unwrap();
      } catch (error) {
        console.error(error);
      }
    },
    [acceptAppointment],
  );

  const handleRejectAppointment = useCallback(
    async (id: number) => {
      try {
        await rejectAppointment(id).unwrap();
      } catch (error) {
        console.error(error);
      }
    },
    [rejectAppointment],
  );

  const handleCancelAppointment = useCallback(
    async (id: number) => {
      try {
        await cancelAppointment(id).unwrap();
      } catch (error) {
        console.error(error);
      }
    },
    [cancelAppointment],
  );

  const handleClickAppointment = useCallback((id: number) => {
    setSelectedAppointmentId(id);
    setIsAppointmentModalOpen(true);
  }, []);

  const handleCloseAppointmentModal = useCallback(() => {
    setSelectedAppointmentId(null);
    setIsAppointmentModalOpen(false);
  }, []);

  const handleCloseDialogModal = useCallback(() => {
    setDialogModalProps(initialDialogModalProps);
  }, []);

  const handleOpenDialogModal = useCallback(
    (confirmType: CONFIRM_MODAL_TYPE, id: number) => {
      const dialogModalProps: DialogModalProps = {
        open: true,
        title: t(CONFIRM_MODAL_VALUES[confirmType].titleKey),
        description: t(CONFIRM_MODAL_VALUES[confirmType].descriptionKey),
        handleCancel: handleCloseDialogModal,
        handleConfirm: () => {
          switch (confirmType) {
            case CONFIRM_MODAL_TYPE.REJECT_REQUEST:
              handleRejectAppointment(id);
              break;
            case CONFIRM_MODAL_TYPE.CANCEL_REQUEST:
              handleCancelAppointment(id);
              break;
            case CONFIRM_MODAL_TYPE.CANCEL_APPOINTMENT:
              handleCancelAppointment(id);
              break;
          }
          handleCloseDialogModal();
          handleCloseAppointmentModal();
        },
      };

      setDialogModalProps(dialogModalProps);
    },
    [
      t,
      handleRejectAppointment,
      handleCancelAppointment,
      handleCloseDialogModal,
    ],
  );

  useEffect(() => {
    setMyAppointments((prev) => ({
      ...prev,
      [MY_APPOINTMENTS_LIST_STATE.PENDING]:
        myPendingAppointments || prev[MY_APPOINTMENTS_LIST_STATE.PENDING],
      [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]:
        myAcceptedAppointments || prev[MY_APPOINTMENTS_LIST_STATE.ACCEPTED],
      [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]:
        myRejectedOrCanceledAppointments ||
        prev[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED],
    }));
  }, [
    myPendingAppointments,
    myAcceptedAppointments,
    myRejectedOrCanceledAppointments,
  ]);

  const value = useMemo<MyAppointmentsProviderContextProps>(
    () => ({
      myAppointments,
      limits,
      pages,
      isAppointmentModalOpen,
      selectedAppointment,
      myAppointmentsDates,
      dialogModalProps,
      handleChangePage,
      handleChangeLimit,
      handleAcceptAppointment,
      handleClickAppointment,
      handleCloseAppointmentModal,
      handleOpenDialogModal,
      handleCloseDialogModal,
    }),
    [
      myAppointments,
      myPendingAppointments,
      myAcceptedAppointments,
      myRejectedOrCanceledAppointments,
      myAppointmentsDates,
      isAppointmentModalOpen,
      selectedAppointment,
      pages,
      limits,
      dialogModalProps,
    ],
  );

  return (
    <MyAppointmentsProviderContext.Provider value={value}>
      {children}
    </MyAppointmentsProviderContext.Provider>
  );
};
