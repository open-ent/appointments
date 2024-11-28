package fr.openent.appointments.repository;

import fr.openent.appointments.model.database.Appointment;
import io.vertx.core.Future;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository {
    Future<Optional<Appointment>> create(Long timeSlotId, String userId);

    Future<List<Appointment>> getAvailableAppointments(Long timeSlotId);
}
