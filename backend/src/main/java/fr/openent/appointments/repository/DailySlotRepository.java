package fr.openent.appointments.repository;

import fr.openent.appointments.model.database.DailySlot;
import fr.openent.appointments.model.payload.DailySlotPayload;
import io.vertx.core.Future;

import java.util.List;

public interface DailySlotRepository {
    /**
     * Create multiple daily slots for a specific grid.
     *
     * @param dailySlots a {@link List} of {@link DailySlotPayload} to insert into the database
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link List} of the {@link DailySlot} created and their details.
     */
    Future<List<DailySlot>> create(Long gridId, List<DailySlotPayload> dailySlots);

    /**
     * Get all daily slots for a specific grid.
     *
     * @param gridId the grid id to get the daily slots from
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link List} of the {@link DailySlot} found.
     */
    Future<List<DailySlot>> getByGridId(Long gridId);

    Future<List<DailySlot>> removeByGridId(Long gridId);
}
