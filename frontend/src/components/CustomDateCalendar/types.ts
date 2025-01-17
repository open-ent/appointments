import { Dayjs } from "dayjs";

export interface CustomDateCalendarProps {
  acceptedAppointmentsDates: Dayjs[];
}

export interface StyledDayProps {
  isWithAcceptedAppointment: boolean;
  isToday: boolean;
  isMonthDay: boolean;
  nbWeeksOfCurrentMonth: number;
}
