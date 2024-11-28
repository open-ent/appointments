package fr.openent.appointments.service;

import fr.openent.appointments.model.database.Appointment;
import io.vertx.core.Future;

import java.util.List;

public interface AppointmentService {
    /**
     *  Create an appointment linked to a time slot
     *
     *  @param timeSlotId The time slot id
     *  @return The created appointment
     */
    Future<Appointment> create(Long timeSlotId, String userId, List<String> userGroupsIds);
}
