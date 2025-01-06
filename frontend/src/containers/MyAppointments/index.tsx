import { FC } from "react";

import { mockMinimalAppointments } from "./utils";
import { AppointmentCard } from "~/components/AppointmentCard";

export const MyAppointments: FC = () => {
  return (
    <>
      {mockMinimalAppointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </>
  );
};
