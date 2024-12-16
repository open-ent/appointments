package fr.openent.appointments.service;

import fr.openent.appointments.model.database.Appointment;
import io.vertx.core.Future;

import java.util.List;

public interface AppointmentService {

    /**
     *
     * @param timeSlotId The time slot id
     * @param userId The user id
     * @param userGroupsIds The user groups ids
     * @return if the user can access the time slot
     */
    public Future<Boolean> checkIfUserCanAccessTimeSlot(Long timeSlotId, String userId, List<String> userGroupsIds);


    /**
     *
     * @param timeSlotId The time slot id
     * @return if the time slot is available
     */
    public Future<Boolean> checkIfTimeSlotIsAvailable(Long timeSlotId);

    /**
     *  Create an appointment linked to a time slot
     *
     *  @param timeSlotId The time slot id
     *  @param userId The user id
     *  @param isVideoCall The user choice for video call
     *  @return The created appointment
     */
    Future<Appointment> create(Long timeSlotId, String userId, Boolean isVideoCall);
}
