package fr.openent.appointments.repository.impl;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.*;
import fr.openent.appointments.model.TransactionElement;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.Grid;
import fr.openent.appointments.model.payload.GridPayload;
import fr.openent.appointments.repository.DailySlotRepository;
import fr.openent.appointments.repository.GridRepository;
import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.repository.TimeSlotRepository;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.common.sql.Sql;
import org.entcore.common.sql.SqlResult;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.chrono.ChronoLocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static fr.openent.appointments.core.constants.Constants.FRENCH_NOW;
import static fr.openent.appointments.core.constants.Constants.FRENCH_TIME_ZONE;
import static fr.openent.appointments.core.constants.DateFormat.DATE_TIME_FORMAT_2;
import static fr.openent.appointments.enums.GridState.*;
import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.SqlTables.*;

/**
 * Default implementation of the GridRepository interface.
 */
public class DefaultGridRepository implements GridRepository {

    private final Sql sql;
    private final DailySlotRepository dailySlotRepository;
    private final TimeSlotRepository timeSlotRepository;

    public DefaultGridRepository(RepositoryFactory repositoryFactory) {
        this.sql = repositoryFactory.sql();
        this.dailySlotRepository = repositoryFactory.dailySlotRepository();
        this.timeSlotRepository = repositoryFactory.timeSlotRepository();
    }

    @Override
    public Future<List<Grid>> getMyGrids(String userId, List<GridState> gridStates) {
        Promise<List<Grid>> promise = Promise.promise();

        String query = "SELECT * FROM " + DB_GRID_TABLE + " WHERE " + OWNER_ID + " = ? ";
        JsonArray params = new JsonArray().add(userId);

        // Filtering by states
        if (gridStates != null && !gridStates.isEmpty()) {
            query += " AND " + STATE + " IN " + Sql.listPrepared(gridStates);
            params.addAll(new JsonArray(gridStates.stream().map(GridState::getValue).collect(Collectors.toList())));
        }

        query += "ORDER BY " + CREATION_DATE + " DESC";

        String errorMessage = String.format("[Appointments@DefaultGridRepository::getMyGrids] Fail to get grids for userId %s : ", userId);
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, Grid.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<JsonArray> getMyGridsByName(String userId, String gridName, List<GridState> gridStates) {
        Promise<JsonArray> promise = Promise.promise();

        StringBuilder queryBuilder = new StringBuilder("SELECT * FROM " + DB_GRID_TABLE + " WHERE " + OWNER_ID + " = ?");
        JsonArray params = new JsonArray().add(userId);

        if (gridName != null) {
            queryBuilder.append(" AND ").append(NAME).append(" = ?");
            params.add(gridName);
        }

        if (gridStates != null && !gridStates.isEmpty()) {
            queryBuilder.append(" AND ").append(STATE).append(" IN ")
                        .append(Sql.listPrepared(gridStates.toArray()));
            params.addAll(new JsonArray(gridStates.stream().map(GridState::getValue).collect(Collectors.toList())));
        }


        String query = queryBuilder.toString();
        String errorMessage = "[Appointments@DefaultGridRepository::getMyGridsByName] Fail to get grids : ";
        sql.prepared(query, params, SqlResult.validResultHandler(FutureHelper.handlerEither(promise, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<Grid>> getGridsByUserIds(List<String> usersIds) {
        Promise<List<Grid>> promise = Promise.promise();

        if (usersIds == null || usersIds.isEmpty()) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        String query = "SELECT * FROM " + DB_GRID_TABLE + " WHERE " + OWNER_ID + " IN " + Sql.listPrepared(usersIds);
        JsonArray params = new JsonArray(usersIds);

        String errorMessage = String.format("[Appointments@DefaultGridRepository::getGridsByUserIds] Fail to get grids for usersIds %s : ", usersIds);
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, Grid.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<Grid>> getGridsGroupsCanAccess(List<String> groupsIds) {
        Promise<List<Grid>> promise = Promise.promise();

        if (groupsIds == null || groupsIds.isEmpty()) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        // The '~' annotation allows to execute a REGEX with case sensitivity
        String query = "SELECT * FROM " + DB_GRID_TABLE + " WHERE " + TARGET_PUBLIC_LIST_ID + " ~ '" + String.join("|", groupsIds) + "';";
        JsonArray params = new JsonArray();

        String errorMessage = String.format("[Appointments@DefaultGridRepository::getGridsGroupsCanAccess] Fail to get grids the groups %s can access : ", groupsIds);
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, Grid.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<Grid>> getGridsWithAvailableTimeSlots(List<Long> gridsIds) {
        Promise<List<Grid>> promise = Promise.promise();

        if (gridsIds == null || gridsIds.isEmpty()) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        List<String> availableAppointmentStates = AppointmentState.getAvailableStates();

        String query = "SELECT DISTINCT g.* FROM " + DB_GRID_TABLE + " g " +
                "JOIN " + DB_TIME_SLOT_TABLE + " ts ON ts.grid_id = g.id " +
                "LEFT JOIN " + DB_APPOINTMENT_TABLE + " a ON a.time_slot_id = ts.id " +
                "WHERE g.id IN " + Sql.listPrepared(gridsIds) +
                "AND g.state = ? " +
                "AND ts.begin_date > " + FRENCH_NOW + " " +
                "AND (a.id IS NULL OR a.state NOT IN " +
                Sql.listPrepared(availableAppointmentStates) +
                ");";

        JsonArray params = new JsonArray()
                .addAll(new JsonArray(gridsIds))
                .add(GridState.OPEN.getValue())
                .addAll(new JsonArray(availableAppointmentStates));

        String errorMessage = String.format("[Appointments@DefaultGridRepository::getGridsWithAvailableTimeSlots] Failed to get grids with available timeslots from grid ids %s : ", gridsIds);
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, Grid.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<JsonArray> getGridsName (String userId) {
        Promise<JsonArray> promise = Promise.promise();

        String query = "SELECT " + NAME + " FROM " + DB_GRID_TABLE + " WHERE " + OWNER_ID + " = ? AND " + STATE + " IN (?, ?)";
        JsonArray params = new JsonArray()
                .add(userId)
                .add(GridState.OPEN.getValue())
                .add(GridState.SUSPENDED.getValue());

        String errorMessage = "[Appointments@DefaultGridRepository::getGridsName] Fail to get grids name : ";
        sql.prepared(query, params, SqlResult.validResultHandler(FutureHelper.handlerEither(promise, errorMessage)));

        return promise.future().map(jsonArray -> {
            JsonArray names = new JsonArray();
            jsonArray.forEach(grid -> names.add(((JsonObject) grid).getString(NAME)));
            return names;
        });
    }

    @Override
    public Future<Optional<Grid>> get(Long gridId) {
        Promise<Optional<Grid>> promise = Promise.promise();

        String query = "SELECT * FROM " + DB_GRID_TABLE + " WHERE " + ID + " = ?";
        JsonArray params = new JsonArray().add(gridId);

        String errorMessage = String.format("[Appointments@DefaultGridRepository::get] Fail to get grid with id %d : ", gridId);
        sql.prepared(query, params, SqlResult.validUniqueResultHandler(IModelHelper.uniqueResultToIModel(promise, Grid.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<Grid> create(GridPayload gridPayload, String userId) {
        Promise<Grid> promise = Promise.promise();

        insert(gridPayload, userId)
            .compose(optionalGrid -> {
                if (!optionalGrid.isPresent()) {
                    String errorMessage = "No content returned by database after creation of the grid";
                    LogHelper.logError(this, "create", errorMessage);
                    return Future.failedFuture(errorMessage);
                }

                Grid createdGrid = optionalGrid.get();
                try {
                    return createSlots(createdGrid, gridPayload);
                } catch (Exception e) {
                    e.printStackTrace();
                    return Future.failedFuture(e.getMessage());
                }
            })
            .onSuccess(promise::complete)
            .onFailure(err -> {
                String errorMessage = "Failed to create grid";
                LogHelper.logError(this, "create", errorMessage, err.getMessage());
                promise.fail(err.getMessage());
            });

        return promise.future();
    }

    @Override
    public Future<JsonObject> closeAllPassedGrids() {
        Promise<JsonObject> promise = Promise.promise();
        
        String query = "UPDATE " + DB_GRID_TABLE + " SET " + STATE + " = ? WHERE " + END_DATE + " < " + FRENCH_NOW;
        JsonArray params = new JsonArray().add(CLOSED);

        String errorMessage = "[Appointments@DefaultGridRepository::closeAllPassedGrids] Fail to close passed grids : ";
        sql.prepared(query, params, SqlResult.validUniqueResultHandler(FutureHelper.handlerEither(promise, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<Optional<Grid>> updateFields(Long gridId, GridPayload grid){
        Promise<Optional<Grid>> promise = Promise.promise();

        String name = grid.getGridName();
        String color = grid.getColor();
        String videoCallLink = grid.getVideoCallLink();
        String place = grid.getPlace();
        List<String> documentsIds = grid.getDocumentsIds();
        String publicComment = grid.getPublicComment();

        boolean isNameUpdatable = name != null && !name.isEmpty();
        boolean isColorUpdatable = color != null;
        boolean isVideoCallLinkUpdatable = videoCallLink != null;
        boolean isPlaceUpdatable = place != null;
        boolean isDocumentsIdsUpdatable = documentsIds != null;
        boolean isPublicCommentUpdatable = publicComment != null;

        String query = "UPDATE " + DB_GRID_TABLE + " SET " + UPDATING_DATE + " = ?, ";
        if (isNameUpdatable) query += NAME + " = ?, ";
        if (isColorUpdatable) query += COLOR + " = ?, ";
        if (isVideoCallLinkUpdatable) query += VIDEO_CALL_LINK + " = ?, ";
        if (isPlaceUpdatable) query += PLACE + " = ?, ";
        if (isDocumentsIdsUpdatable) query += DOCUMENTS_IDS + " = ?, ";
        if (isPublicCommentUpdatable) query += PUBLIC_COMMENT + " = ?, ";
        query = query.substring(0, query.length() - 2) + " WHERE " + ID + " = ? RETURNING *";

        String frenchNow = ZonedDateTime.now(ZoneId.of(FRENCH_TIME_ZONE))
                .format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT_2));

        JsonArray params = new JsonArray().add(frenchNow);
        if (isNameUpdatable) params.add(name);
        if (isColorUpdatable) params.add(color);
        if (isVideoCallLinkUpdatable) params.add(videoCallLink);
        if (isPlaceUpdatable) params.add(place);
        if (isDocumentsIdsUpdatable) params.add(documentsIds.toString());
        if (isPublicCommentUpdatable) params.add(publicComment);
        params.add(gridId);

        String errorMessage = "[Appointments@DefaultGridRepository::updateFields] Fail to update grid fields : ";
        sql.prepared(query, params, SqlResult.validUniqueResultHandler(IModelHelper.uniqueResultToIModel(promise, Grid.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<Appointment>> updateState(Long gridId, GridState state, boolean deleteAppointments){
        Promise<List<Appointment>> promise = Promise.promise();

        List<String> availableAppointmentStates = AppointmentState.getAvailableStates();

        String updateGridQuery = "UPDATE " + DB_GRID_TABLE + " SET " + STATE + " = ? WHERE id = ?";
        JsonArray gridParams = new JsonArray().add(state.name()).add(gridId);

        String updateAppointmentsQuery = "UPDATE " + DB_APPOINTMENT_TABLE + " SET " + STATE + " = ? " +
                "WHERE time_slot_id IN (SELECT id FROM " + DB_TIME_SLOT_TABLE + " WHERE grid_id = ?) AND " + STATE +
                " IN " + Sql.listPrepared(availableAppointmentStates) + " RETURNING *";
        JsonArray appointmentParams = new JsonArray().add(AppointmentState.CANCELED).add(gridId).addAll(new JsonArray(availableAppointmentStates));

        String errorMessage = "[Appointments@DefaultGridRepository::updateState] Fail to update grid state or associated appointments: ";

        List<TransactionElement> transactionElements = new ArrayList<>();
        transactionElements.add(new TransactionElement(updateGridQuery, gridParams));
        if (deleteAppointments) {
            transactionElements.add(new TransactionElement(updateAppointmentsQuery, appointmentParams));
        }

        TransactionHelper.executeTransaction(transactionElements, errorMessage)
            .onSuccess(result -> {
                List<Appointment> appointments = transactionElements.stream()
                        .flatMap(element -> element.getResult().stream())
                        .map(appointmentJson -> new Appointment((JsonObject) appointmentJson))
                        .collect(Collectors.toList());
                promise.complete(appointments);
            })
            .onFailure(err -> {
                LogHelper.logError(this, "updateState", errorMessage, err.getMessage());
                promise.fail(err.getMessage());
            });

        return promise.future();
    }

    // Private functions

    private Future<Optional<Grid>> insert(GridPayload grid, String userId) {
        Promise<Optional<Grid>> promise = Promise.promise();

        String frenchNow = ZonedDateTime.now(ZoneId.of(FRENCH_TIME_ZONE))
                .format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT_2));

        List<String> sqlColumns = Arrays.asList(
                NAME,
                OWNER_ID,
                STRUCTURE_ID,
                BEGIN_DATE,
                END_DATE,
                CREATION_DATE,
                UPDATING_DATE,
                COLOR,
                DURATION,
                PERIODICITY,
                TARGET_PUBLIC_LIST_ID,
                VIDEO_CALL_LINK,
                PLACE,
                DOCUMENTS_IDS,
                PUBLIC_COMMENT,
                STATE);

        String query = "INSERT INTO "+ DB_GRID_TABLE + " (" + String.join(", ", sqlColumns) + ") " +
                "VALUES " + Sql.listPrepared(sqlColumns) + " RETURNING *";

        GridState state = grid.getEndDate().isBefore(ChronoLocalDate.from(ZonedDateTime.now(ZoneId.of(FRENCH_TIME_ZONE)))) ? CLOSED : OPEN;

        JsonArray params = new JsonArray()
                .add(grid.getGridName())
                .add(userId)
                .add(grid.getStructureId())
                .add(DateHelper.formatDate(grid.getBeginDate()))
                .add(DateHelper.formatDate(grid.getEndDate()))
                .add(frenchNow)
                .add(frenchNow)
                .add(grid.getColor())
                .add(DateHelper.formatDuration(grid.getDuration()))
                .add(grid.getPeriodicity().getValue())
                .add(grid.getTargetPublicIds().toString())
                .add(grid.getVideoCallLink())
                .add(grid.getPlace())
                .add(grid.getDocumentsIds().toString())
                .add(grid.getPublicComment())
                .add(state.getValue());

        String errorMessage = "[Appointments@DefaultGridRepository::insert] Fail to insert grid : ";
        sql.prepared(query, params, SqlResult.validUniqueResultHandler(IModelHelper.uniqueResultToIModel(promise, Grid.class, errorMessage)));
        return promise.future();
    }

    public Future<Grid> createSlots(Grid grid, GridPayload gridPayload) {
        Promise<Grid> promise = Promise.promise();

        dailySlotRepository.create(grid.getId(), gridPayload.getDailySlots())
            .compose(createdDailySlots -> timeSlotRepository.create(grid.getId(), gridPayload.getTimeSlots()))
            .onSuccess(timeSlots -> promise.complete(grid))
            .onFailure(err -> {
                String errorMessage = "Failed to create grid";
                LogHelper.logError(this, "createSlots", errorMessage, err.getMessage());
                promise.fail(err.getMessage());
            });

        return promise.future();
    }
}
