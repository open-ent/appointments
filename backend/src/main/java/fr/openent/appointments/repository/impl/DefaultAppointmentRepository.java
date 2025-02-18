package fr.openent.appointments.repository.impl;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.AppointmentWithInfos;
import fr.openent.appointments.repository.AppointmentRepository;
import fr.openent.appointments.repository.RepositoryFactory;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import org.entcore.common.sql.Sql;
import org.entcore.common.sql.SqlResult;

import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.SqlTables.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static fr.openent.appointments.core.constants.Constants.FRENCH_NOW;

public class DefaultAppointmentRepository implements AppointmentRepository {

    private final Sql sql;

    public DefaultAppointmentRepository(RepositoryFactory repositoryFactory) {
        this.sql = repositoryFactory.sql();
    }

    @Override
    public Future<Optional<Appointment>> create(Long timeSlotId, String userId, Boolean isVideoCall) {
        Promise<Optional<Appointment>> promise = Promise.promise();

        if (timeSlotId == null) {
            promise.complete(Optional.empty());
            return promise.future();
        }

        List<String> sqlColumns = Arrays.asList(TIME_SLOT_ID, REQUESTER_ID, STATE, IS_VIDEO_CALL);
        String query = "INSERT INTO " + DB_APPOINTMENT_TABLE + " (" + String.join(", ", sqlColumns) + ") " +
                "VALUES " + Sql.listPrepared(sqlColumns) + " RETURNING *";

        JsonArray params = new JsonArray()
                .add(timeSlotId)
                .add(userId)
                .add(AppointmentState.CREATED.getValue())
                .add(isVideoCall);

        String errorMessage = "[Appointemnts@DefaultAppointmentRepository::create] Failed to create appointment : ";
        sql.prepared(query, params, SqlResult.validUniqueResultHandler(IModelHelper.uniqueResultToIModel(promise, Appointment.class, errorMessage)));
        return promise.future();
    }

    @Override
    public Future<List<Appointment>> getAvailableAppointments(Long timeSlotId){
        Promise<List<Appointment>> promise = Promise.promise();

        if (timeSlotId == null) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        List<String> availableStates = AppointmentState.getAvailableStates();

        String query = "SELECT * FROM " + DB_APPOINTMENT_TABLE + " WHERE " + TIME_SLOT_ID + " = ? AND " + STATE + " IN " + Sql.listPrepared(availableStates);

        JsonArray params = new JsonArray()
                .add(timeSlotId)
                .addAll(new JsonArray(availableStates));

        String errorMessage = "[Appointemnts@DefaultAppointmentRepository::getAvailableAppointments] Failed to get available appointments : ";
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, Appointment.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<AppointmentWithInfos>> getAppointments(String userId, List<AppointmentState> states, Boolean ignorePast) {
        Promise<List<AppointmentWithInfos>> promise = Promise.promise();

        if (userId == null) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        String query = "SELECT a.*, ts.begin_date, ts.end_date, g.owner_id, g.video_call_link " +
                "FROM " + DB_APPOINTMENT_TABLE + " a " +
                "JOIN " + DB_TIME_SLOT_TABLE + " ts ON a.time_slot_id = ts.id " +
                "LEFT JOIN " + DB_GRID_TABLE + " g ON ts.grid_id = g.id " +
                "WHERE (a.requester_id = ? OR g.owner_id = ?) ";
        JsonArray params = new JsonArray().add(userId).add(userId);

        // Filter by states
        if (states != null && !states.isEmpty()) {
            query += " AND a.state IN " + Sql.listPrepared(states);
            params.addAll(new JsonArray(states.stream().map(AppointmentState::getValue).collect(Collectors.toList())));
        }

        if (ignorePast) {
            query += " AND ts.end_date > " + FRENCH_NOW;
        }

        // Order by start date
        query += " ORDER BY ts.begin_date";

        String errorMessage = String.format("[Appointemnts@DefaultAppointmentRepository::getAppointments] Failed to get appointments for user %s : ", userId);
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, AppointmentWithInfos.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<Optional<AppointmentWithInfos>> get(Long appointmentId){
        Promise<Optional<AppointmentWithInfos>> promise = Promise.promise();

        if (appointmentId == null) {
            promise.complete(Optional.empty());
            return promise.future();
        }

        String query = "SELECT a.*, ts.begin_date, ts.end_date, g.owner_id, g.video_call_link, " +
                "g.place, g.documents_ids, g.public_comment " +
                "FROM " + DB_APPOINTMENT_TABLE + " a " +
                "JOIN " + DB_TIME_SLOT_TABLE + " ts ON a.time_slot_id = ts.id " +
                "LEFT JOIN " + DB_GRID_TABLE + " g ON ts.grid_id = g.id " +
                "WHERE a.id = ?";

        JsonArray params = new JsonArray().add(appointmentId);

        String errorMessage = String.format("[Appointemnts@DefaultAppointmentRepository::get] Failed to get appointment %d : ", appointmentId);
        sql.prepared(query, params, SqlResult.validUniqueResultHandler(IModelHelper.uniqueResultToIModel(promise, AppointmentWithInfos.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<Optional<Appointment>> updateState(Long appointmentId, AppointmentState state){
        Promise<Optional<Appointment>> promise = Promise.promise();

        if (appointmentId == null || state == null) {
            promise.complete(Optional.empty());
            return promise.future();
        }

        String query = "UPDATE " + DB_APPOINTMENT_TABLE + " SET " + STATE + " = ? WHERE id = ? RETURNING *";

        JsonArray params = new JsonArray().add(state.getValue()).add(appointmentId);

        String errorMessage = String.format("[Appointemnts@DefaultAppointmentRepository::updateState] Failed to update state of appointment %d : ", appointmentId);
        sql.prepared(query, params, SqlResult.validUniqueResultHandler(IModelHelper.uniqueResultToIModel(promise, Appointment.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<Appointment>> getAppointmentsByGridId(Long gridId, List<AppointmentState> states, Boolean ignorePast){
        Promise<List<Appointment>> promise = Promise.promise();

        if (gridId == null) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        String query = "SELECT a.* FROM " + DB_APPOINTMENT_TABLE + " a " +
                "JOIN " + DB_TIME_SLOT_TABLE + " ts ON a.time_slot_id = ts.id " +
                "WHERE ts.grid_id = ?";

        JsonArray params = new JsonArray().add(gridId);

        // Filter by states
        if (states != null && !states.isEmpty()) {
            query += " AND a.state IN " + Sql.listPrepared(states);
            params.addAll(new JsonArray(states.stream().map(AppointmentState::getValue).collect(Collectors.toList())));
        }

        if (ignorePast) {
            query += " AND ts.end_date > " + FRENCH_NOW;
        }

        String errorMessage = String.format("[Appointemnts@DefaultAppointmentRepository::getAppointmentsByGridId] Failed to get appointments for grid %d : ", gridId);
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, Appointment.class, errorMessage)));

        return promise.future();
    }
}
