package fr.openent.appointments.service;

import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.model.response.ListGridsResponse;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.http.HttpServerRequest;
import fr.openent.appointments.model.payload.GridPayload;

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
    Future<JsonArray> getGridById(Integer gridId);

    /**
     * Retrieves all grids associated with a specific user.
     *
     * @param userId The ID of the user whose grids are to be retrieved.
     * @return A Future containing a JsonArray of grids associated with the user.
     */
    Future<JsonArray> getUserGrids(Integer userId);

    /**
     * Creates a new grid.
     *
     * @param grid A JsonArray containing the data of the grid to be created.
     * @return A Future containing {@Link Grid} that will complete when the grid has been created.
     */
    Future<Grid> createGrid(HttpServerRequest request, GridPayload grid);

    /**
     * Updates an existing grid.
     *
     * @param gridId The ID of the grid to update.
     * @param grid A JsonArray containing the updated data for the grid.
     * @return A Future that will complete when the grid has been updated.
     */
    Future<Void> updateGrid(Integer gridId, JsonArray grid);

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
    Future<Void> deleteGrid(Integer gridId);

    /**
     * Close all the grid with an ending date in the past
     *
     * @return A Future that will complete when the grids have been updated.
     */
    Future<JsonObject> closeAllPassedGrids();
}
