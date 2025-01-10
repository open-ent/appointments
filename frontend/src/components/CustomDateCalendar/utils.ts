import { Dayjs } from "dayjs";

export const isWithAcceptedAppointment = (
  date: Dayjs,
  acceptedAppointmentsDates: Dayjs[],
) => {
  return acceptedAppointmentsDates.some((acceptedDate) =>
    acceptedDate.isSame(date, "day"),
  );
};
