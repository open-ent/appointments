/* eslint-disable no-case-declarations */
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
import { toast } from "react-toastify";

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
import { useGlobal } from "../GlobalProvider";
import { DialogModalProps } from "~/components/DialogModal/types";
import { CONFIRM_MODAL_VALUES, TOAST_VALUES } from "~/core/constants";
import {
  APPOINTMENT_STATE,
  CONFIRM_MODAL_TYPE,
  TOAST_TYPE,
} from "~/core/enums";
import {
  useAcceptAppointmentMutation,
  useCancelAppointmentMutation,
  useGetAppointmentIndexQuery,
  useGetAppointmentQuery,
  useGetAppointmentsDatesQuery,
  useGetMyAppointmentsQuery,
  useRejectAppointmentMutation,
} from "~/services/api/AppointmentService";
import { Appointment } from "~/services/api/AppointmentService/types";

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
  const { appointmentIdFromNotify } = useGlobal();
  const [pages, setPages] = useState<AppointmentListInfoType>(initialPages);
  const [maxPages, setMaxPages] =
    useState<AppointmentListInfoType>(initialPages);
  const [limits, setLimits] = useState<AppointmentListInfoType>(initialLimits);
  const [myAppointments, setMyAppointments] =
    useState<AppointmentsType>(initialAppointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
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

  const { data: selectedAppointmentData, isFetching } = useGetAppointmentQuery(
    selectedAppointmentId as number,
    { skip: !selectedAppointmentId },
  );

  const { data: appointmentIndexFromNotif } = useGetAppointmentIndexQuery(
    appointmentIdFromNotify as number,
    {
      skip: !appointmentIdFromNotify,
    },
  );

  const { data: appointmentFromNotif } = useGetAppointmentQuery(
    appointmentIdFromNotify as number,
    {
      skip: !appointmentIdFromNotify,
    },
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
        toast.success(t(TOAST_VALUES.ACCEPT_APPOINTMENT.i18nKeySuccess));
      } catch (error) {
        console.error(error);
        toast.error(t(TOAST_VALUES.ACCEPT_APPOINTMENT.i18nKeyError));
      }
    },
    [acceptAppointment],
  );

  const handleRejectAppointment = useCallback(
    async (id: number) => {
      try {
        await rejectAppointment(id).unwrap();
        toast.success(t(TOAST_VALUES.REJECT_APPOINTMENT.i18nKeySuccess));
      } catch (error) {
        console.error(error);
        toast.error(t(TOAST_VALUES.REJECT_APPOINTMENT.i18nKeyError));
      }
    },
    [rejectAppointment],
  );

  const handleCancelAppointment = useCallback(
    async (id: number, toastType: TOAST_TYPE) => {
      try {
        await cancelAppointment(id).unwrap();
        toast.success(t(TOAST_VALUES[toastType].i18nKeySuccess));
      } catch (error) {
        console.error(error);
        toast.error(t(TOAST_VALUES[toastType].i18nKeyError));
      }
    },
    [cancelAppointment],
  );

  const handleClickAppointment = useCallback((id: number) => {
    setSelectedAppointmentId(id);
  }, []);

  const handleCloseAppointmentModal = useCallback(() => {
    setSelectedAppointmentId(null);
    setSelectedAppointment(null);
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
              handleCancelAppointment(id, TOAST_TYPE.CANCEL_REQUEST);
              break;
            case CONFIRM_MODAL_TYPE.CANCEL_APPOINTMENT:
              handleCancelAppointment(id, TOAST_TYPE.CANCEL_APPOINTMENT);
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
    if (selectedAppointmentData && selectedAppointmentId && !isFetching) {
      setSelectedAppointment(selectedAppointmentData);
    }
  }, [selectedAppointmentData, selectedAppointmentId, isFetching]);

  useEffect(() => {
    if (appointmentIndexFromNotif && appointmentFromNotif) {
      const { state } = appointmentFromNotif;
      switch (state) {
        case APPOINTMENT_STATE.CREATED:
          const createdLimit = limits[MY_APPOINTMENTS_LIST_STATE.PENDING];
          const newCreatedPage = Math.floor(
            appointmentIndexFromNotif / createdLimit,
          );
          setPages((prev) => ({
            ...prev,
            [MY_APPOINTMENTS_LIST_STATE.PENDING]: newCreatedPage + 1,
          }));
          break;
        case APPOINTMENT_STATE.ACCEPTED:
          const acceptedLimit = limits[MY_APPOINTMENTS_LIST_STATE.ACCEPTED];
          const newAcceptedPage = Math.floor(
            appointmentIndexFromNotif / acceptedLimit,
          );
          setPages((prev) => ({
            ...prev,
            [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]: newAcceptedPage + 1,
          }));
          break;
        case APPOINTMENT_STATE.REFUSED:
        case APPOINTMENT_STATE.CANCELED:
          const rejectedOrCanceledLimit =
            limits[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED];
          const newRejectedOrCanceledPage = Math.floor(
            appointmentIndexFromNotif / rejectedOrCanceledLimit,
          );
          setPages((prev) => ({
            ...prev,
            [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]:
              newRejectedOrCanceledPage + 1,
          }));
          break;
        default:
          break;
      }
    }
  }, [appointmentIndexFromNotif, appointmentFromNotif, limits]);

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

  useEffect(() => {
    if (
      myPendingAppointments &&
      myAcceptedAppointments &&
      myRejectedOrCanceledAppointments
    )
      setMaxPages((prev) => ({
        ...prev,
        [MY_APPOINTMENTS_LIST_STATE.PENDING]:
          Math.ceil(
            myPendingAppointments?.total /
              limits[MY_APPOINTMENTS_LIST_STATE.PENDING],
          ) || 1,
        [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]:
          Math.ceil(
            myAcceptedAppointments?.total /
              limits[MY_APPOINTMENTS_LIST_STATE.ACCEPTED],
          ) || 1,
        [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]:
          Math.ceil(
            myRejectedOrCanceledAppointments?.total /
              limits[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED],
          ) || 1,
      }));
  }, [
    myPendingAppointments,
    myAcceptedAppointments,
    myRejectedOrCanceledAppointments,
    limits,
  ]);

  useEffect(() => {
    if (
      pages[MY_APPOINTMENTS_LIST_STATE.PENDING] >
      maxPages[MY_APPOINTMENTS_LIST_STATE.PENDING]
    ) {
      setPages((prev) => ({
        ...prev,
        [MY_APPOINTMENTS_LIST_STATE.PENDING]:
          maxPages[MY_APPOINTMENTS_LIST_STATE.PENDING],
      }));
    }
    if (
      pages[MY_APPOINTMENTS_LIST_STATE.ACCEPTED] >
      maxPages[MY_APPOINTMENTS_LIST_STATE.ACCEPTED]
    ) {
      setPages((prev) => ({
        ...prev,
        [MY_APPOINTMENTS_LIST_STATE.ACCEPTED]:
          maxPages[MY_APPOINTMENTS_LIST_STATE.ACCEPTED],
      }));
    }
    if (
      pages[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED] >
      maxPages[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]
    ) {
      setPages((prev) => ({
        ...prev,
        [MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED]:
          maxPages[MY_APPOINTMENTS_LIST_STATE.REJECTED_OR_CANCELED],
      }));
    }
  }, [maxPages]);

  const value = useMemo<MyAppointmentsProviderContextProps>(
    () => ({
      myAppointments,
      limits,
      pages,
      maxPages,
      selectedAppointment,
      selectedAppointmentId,
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
      selectedAppointment,
      selectedAppointmentId,
      pages,
      maxPages,
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
