package fr.openent.appointments.service;

import fr.openent.appointments.model.database.Grid;
import fr.openent.appointments.model.database.TimeSlot;
import fr.openent.appointments.model.response.TimeSlotsAvailableResponse;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import org.entcore.common.user.UserInfos;

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

    /**
     * Retrieve if slot is linked to a grid that allow video call
     *
     * @param timeSlotId The ID of the time slot
     */
    Future<Boolean> checkIfTimeSlotIsVideoCall(Long timeSlotId);

    /**
     * Retrieve all the timeslots of a specified grid between two dates (included)
     *
     * @param user The {@link UserInfos} of the user connected user.
     * @param gridId The ID of the {@link Grid} of which we retrieve timeslots
     * @param beginDate The date from which we start retrieving timeslots
     * @param endDate The limit date we stop retrieving timeslots
     * @return A {@link Future} representing the asynchronous operation, which will
     *         return a {@link TimeSlotsAvailableResponse} containing all the available timeslots for the specified interval.
     */
    Future<TimeSlotsAvailableResponse> getAvailableTimeSlotsByDates(UserInfos user, Long gridId, LocalDate beginDate, LocalDate endDate);
}
