package fr.openent.appointments.repository;

import fr.openent.appointments.model.database.TimeSlot;
import fr.openent.appointments.model.payload.TimeSlotPayload;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;

import java.util.List;
import java.util.Optional;

public interface TimeSlotRepository {
    /**
     * Create multiple time slots for a specific grid.
     *
     * @param timeSlots a {@link List<TimeSlotPayload>} to insert into the database
     * @return A {@link Future} representing the asynchronous operation, which will
     *         return a {@link List<TimeSlot>} of the created timeslots and their details.
     */
    Future<List<TimeSlot>> create(Long gridId, List<TimeSlotPayload> timeSlots);

    /**
     * Retrieve connected user's last appointment date for specific grid owners
     *
     * @param userId The ID of the connected user
     * @param ownersIds The IDs of the owners of the grid we are interested in
     * @return A {@link Future} representing the asynchronous operation, which will
     *         return a {@link JsonArray} containing for each grid owner id the date of
     *         last appointment for the connected user.
     */
    Future<JsonArray> getLastAppointmentDateByGridOwner(String userId, List<String> ownersIds);


    /**
     * Retrieve time slot by its ID
     *
     * @param timeSlotId The ID of the time slot
     * @return A {@link Future} representing the asynchronous operation, which will
     *        return an {@link Optional<TimeSlot>} containing the time slot if it exists.
     */
    Future<Optional<TimeSlot>> get(Long timeSlotId);
}
