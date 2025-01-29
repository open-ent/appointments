package fr.openent.appointments.repository;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.AppointmentWithInfos;
import io.vertx.core.Future;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository {
    Future<Optional<Appointment>> create(Long timeSlotId, String userId, Boolean isVideoCall);

    Future<List<Appointment>> getAvailableAppointments(Long timeSlotId);

    Future<List<AppointmentWithInfos>> getAppointments(String userId, List<AppointmentState> states, Boolean ignorePast);

    Future<Optional<AppointmentWithInfos>> get(Long appointmentId);

    Future<Optional<Appointment>> updateState(Long appointmentId, AppointmentState state);

    Future<List<Appointment>> getAcceptedAppointments(Long gridId);
}
