package fr.openent.appointments.service;

import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Interface for managing grid operations in the appointment service.
 */
public interface TimeSlotService {

    /**
     * Retrieves all minimized grids associated with the current user.
     *
     * @param userId The ID of the connected user
     * @param ownersIds The IDs of the owners of the grid we are interested in
     * @return A {@link Future} representing the asynchronous operation, which will
     *         return a {@link Map}<{@link String},{@link LocalDate}> containing for each grid owner id the date of
     *         last appointment for the connected user.
     */
    Future<Map<String,LocalDate>> getLastAppointmentDateByGridOwner(String userId, List<String> ownersIds);

    /**
     * Retrieve if slotId is linked to a grid that user is in groups of the grid
     *
     * @param userId The ID of the connected user
     * @param timeSlotId The ID of the time slot
     */
    Future<Boolean> checkIfUserCanAccessTimeSlot(Long timeSlotId, String userId, List<String> userGroupsIds);

    /**
     * Retrieve if slot is available (not already booked)
     *
     * @param timeSlotId The ID of the time slot
     */
    Future<Boolean> checkIfTimeSlotIsAvailable(Long timeSlotId);
}
