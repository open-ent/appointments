import { Dayjs } from "dayjs";
import { DAY } from "~/core/dayjs.const";

export const isWithAcceptedAppointment = (
  date: Dayjs,
  acceptedAppointmentsDates: Dayjs[],
) => {
  return acceptedAppointmentsDates.some((acceptedDate) =>
    acceptedDate.isSame(date, DAY),
  );
};
