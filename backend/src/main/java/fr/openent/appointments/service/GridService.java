package fr.openent.appointments.service;

import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.model.response.MinimalGrid;
import fr.openent.appointments.model.response.ListGridsResponse;
import fr.openent.appointments.model.database.Grid;
import fr.openent.appointments.model.response.MinimalGridInfos;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.http.HttpServerRequest;
import fr.openent.appointments.model.payload.GridPayload;
import org.entcore.common.user.UserInfos;

import java.util.List;

/**
 * Interface for managing grid operations in the appointment service.
 */
public interface GridService {

    /**
     * Retrieves all minimized grids associated with the current user.
     *
     * @return A Future containing a JsonArray of grids.
     */
    Future<ListGridsResponse> getMyMinimalGrids(String userId, List<GridState> states, Long page, Long limit);

    /**
     * Retrieves all grids associated with the current user.
     *
     * @return A Future containing a JsonArray of grids.
     */
    Future<List<Grid>> getMyGrids(String userId, List<GridState> states);

    /**
     * Retrieves all grids name associated with the current user.
     *
     * @return A Future containing a JsonArray of grids name.
     */
    Future<JsonArray> getGridsName(String userId);

    /**
     * Retrieves a specific grid by its ID.
     *
     * @param gridId The ID of the grid to retrieve.
     * @return A Future containing a JsonArray with the grid data.
     */
    Future<Grid> getGridById(Long gridId);

    /**
     * Retrieves a specific grid by timeSlotId.
     *
     * @param timeSlotId The ID of the timeSlot to retrieve.
     * @return A Future containing a {@link Grid} with the grid data.
     */
    Future<Grid> getGridByTimeSlotId(Long timeSlotId);

    /**
     * Retrieves all grids associated with a specific user.
     *
     * @param user The {@link UserInfos} of the user connected user.
     * @param userId The ID of the user for which we want to retrieve grids.
     * @return A Future containing a JsonArray of grids associated with the user.
     */
    Future<List<MinimalGrid>> getAvailableUserMinimalGrids(UserInfos user, String userId);

    /**
     * Retrieves the minimal grid infos of the grid with the specified ID.
     *
     * @param user The {@link UserInfos} of the user connected user.
     * @param gridId The ID of the grid we want retrieve minimal infos.
     * @return A Future containing a JsonArray of grids associated with the user.
     */
    Future<MinimalGridInfos> getMinimalGridInfosById(UserInfos user, Long gridId);

    /**
     * Count the number of available timeslots for the specified grids.
     *
     * @param gridsIds A {@link List<Long>} of grid ids for which we count the available timeslots.
     * @return A {@link Future} representing the asynchronous operation, which will
     *         return a {@link List<Long>} containing ths IDs of the grids having a timeslot available.
     */
    Future<List<Long>> getGridsIdsWithAvailableTimeSlots(List<Long> gridsIds);

    /**
     * Creates a new grid.
     *
     * @param grid A JsonArray containing the data of the grid to be created.
     * @return A Future containing {@link Grid} that will complete when the grid has been created.
     */
    Future<Grid> createGrid(HttpServerRequest request, GridPayload grid);

    /**
     * Updates an existing grid.
     *
     * @param gridId The ID of the grid to update.
     * @param grid A GridPayload containing the data to update the grid with.
     * @return A Future that will complete when the grid has been updated.
     */
    Future<Grid> updateGrid(Long gridId, GridPayload grid);

    /**
     * Suspends a specific grid by its ID.
     *
     * @param gridId The ID of the grid to suspend.
     * @return A Future that will complete when the grid has been suspended.
     */
    Future<Void> suspendGrid(Integer gridId);

    /**
     * Restores a suspended grid by its ID.
     *
     * @param gridId The ID of the grid to restore.
     * @return A Future that will complete when the grid has been restored.
     */
    Future<Void> restoreGrid(Integer gridId);

    /**
     * Deletes a specific grid by its ID.
     *
     * @param gridId The ID of the grid to delete.
     * @return A Future that will complete when the grid has been deleted.
     */
    Future<List<String>> deleteGrid(Long gridId, boolean deleteAppointments);

    /**
     * Close all the grid with an ending date in the past
     *
     * @return A Future that will complete when the grids have been updated.
     */
    Future<JsonObject> closeAllPassedGrids();
}
