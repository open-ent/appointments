package fr.openent.appointments.repository;

import fr.openent.appointments.model.payload.GridPayload;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import fr.openent.appointments.enums.GridState;

import java.util.List;

public interface GridRepository {

    /**
     * Retrieves all grids associated with a specific user.
     *
     * @param userId the unique identifier of the user whose grids are to be retrieved.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link JsonArray} containing the details of the grids associated
     *         with the specified user.
     */
    Future<JsonArray> getGrids(String userId);

    /**
     * Retrieves all grids associated with a specific user that match the provided grid name and state.
     *
     * @param userId     the unique identifier of the user whose grids are to be retrieved.
     * @param gridName   the name of the grid to be retrieved.
     * @param gridStates a {@link List} of {@link GridState} objects representing the states of the grids to be retrieved.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link JsonArray} containing the details of the grids associated
     *         with the specified user that match the provided name and state.
     */
    Future<JsonArray> getGrids(String userId, String gridName, List<GridState> gridStates);

    /**
     * Retrieves the name of all grids associated with a specific user.
     *
     * @param userId the unique identifier of the user whose grids are to be retrieved.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link JsonArray} containing the names of the grids associated
     *         with the specified user.
     */
    Future<JsonArray> getGridsName(String userId);

    /**
     * Creates a new grid based on the provided {@link GridPayload} and associates it with a specific user.
     *
     * @param grid   the {@link GridPayload} object containing the details of the grid to be created.
     * @param userId the unique identifier of the user creating the grid.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link JsonObject} containing the result of the creation
     *         operation. This object may include the newly created grid's details or 
     *         an error message if the operation fails.
     */
    Future<JsonObject> create(GridPayload grid, String userId);

    /**
     * Update grids with passed ending dates with the state CLOSED (see {@link GridState})
     *
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link JsonObject} containing the result of the operation.
     *         This object may include the updated grids' details or an error message
     *         if the operation fails.
     */
    Future<JsonObject> closeAllPassedGrids();
}
