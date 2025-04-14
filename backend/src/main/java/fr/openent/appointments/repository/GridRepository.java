package fr.openent.appointments.repository;

import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.Grid;
import fr.openent.appointments.model.payload.GridPayload;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import fr.openent.appointments.enums.GridState;

import java.util.List;
import java.util.Optional;

public interface GridRepository {

    /**
     * Retrieves all grids associated with a specific user.
     *
     * @param userId the unique identifier of the user whose grids are to be retrieved.
     * @param gridStates the states of the grids the user wants to retrieve.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link List} of {@link Grid} containing the details of the grids associated
     *         with the specified user.
     */
    Future<List<Grid>> getMyGrids(String userId, List<GridState> gridStates);

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
    Future<JsonArray> getMyGridsByName(String userId, String gridName, List<GridState> gridStates);

    /**
     * Retrieves all grids associated to a list of a specific user.
     *
     * @param usersIds list of unique identifier of the users whose grids are to be retrieved.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link List<Grid>} containing the details of the grids associated
     *         with the specified users.
     */
    Future<List<Grid>> getGridsByUserIds(List<String> usersIds);

    /**
     * Retrieves all grids a list of groups can access.
     *
     * @param groupsIds the unique identifier of the groups.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link List} of {@link Grid} containing the details of the grids.
     */
    Future<List<Grid>> getGridsGroupsCanAccess(List<String> groupsIds);

    /**
     * Retrieves all the grids from the list with at least one available time slot.
     *
     * @param gridsIds List of IDs of the grids to check.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link List<Grid>} containing the {@link Grid} of the given list
     *         having at least one available time slot.
     */
    Future<List<Grid>> getGridsWithAvailableTimeSlots(List<Long> gridsIds);

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
     * Retrieves the grid with the specified unique identifier.
     *
     * @param gridId the unique identifier of the grid to be retrieved.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link Grid} containing the details of the grid associated
     *         with the specified unique identifier.
     */
    Future<Optional<Grid>> get(Long gridId);

    /**
     * Creates a new grid based on the provided {@link GridPayload} and associates it with a specific user.
     *
     * @param grid   the {@link GridPayload} object containing the details of the grid to be created.
     * @param userId the unique identifier of the user creating the grid.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link Grid} containing the result of the creation
     *         operation. This object may include the newly created grid's details or 
     *         an error message if the operation fails.
     */
    Future<Grid> create(GridPayload grid, String userId);

    /**
     * Update grids with passed ending dates with the state CLOSED (see {@link GridState})
     *
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link JsonObject} containing the result of the operation.
     *         This object may include the updated grids' details or an error message
     *         if the operation fails.
     */
    Future<JsonObject> closeAllPassedGrids();

    /**
     * Update some grid fields
     *
     * @param gridId the unique identifier of the grid to be updated.
     * @param grid the {@link GridPayload} object containing the fields to be updated.
     *
     * @return a {@link Future} representing the asynchronous operation, which will
     *        return a {@link Grid} containing the result of the update operation.
     *        This object may include the updated grid's details or an error message
     *        if the operation fails.
     */
    Future<Optional<Grid>> updateFields(Long gridId, GridPayload grid);

    /**
     * Update grid state with possibility to delete appointments associated
     *
     * @param gridId the unique identifier of the grid to be updated.
     * @param state the new state of the grid.
     * @param deleteAppointments boolean to delete appointments associated with the grid.
     *
     * @return a {@link Future} representing the asynchronous operation, which will
     *          return a List of appointments associated with the grid if deleteAppointments is true
     */
    Future<List<Appointment>> updateState(Long gridId, GridState state, boolean deleteAppointments);

    /**
     * Retrieves all grids associated with a specific state.
     *
     * @param gridStates the states of the grids to be retrieved.
     * @return a {@link Future} representing the asynchronous operation, which will
     *         return a {@link List<Grid>} containing the details of the grids associated
     *         with the specified state.
     */
    Future<List<Grid>> getAllGridsByState(List<GridState> gridStates);
}
