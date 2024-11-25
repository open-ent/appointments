package fr.openent.appointments.repository;

import fr.openent.appointments.model.database.TimeSlot;
import fr.openent.appointments.model.payload.TimeSlotPayload;
import io.vertx.core.Future;

import java.util.List;

public interface TimeSlotRepository {
    /**
     * Create multiple time slots for a specific grid.
     *
     * @param timeSlots a {@link List} of {@link TimeSlotPayload} to insert into the database
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link List} of the {@link TimeSlot} created and their details.
     */
    Future<List<TimeSlot>> create(Long gridId, List<TimeSlotPayload> timeSlots);
}
