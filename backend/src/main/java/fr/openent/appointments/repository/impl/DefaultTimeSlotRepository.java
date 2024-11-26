package fr.openent.appointments.repository.impl;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.FutureHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.helper.TransactionHelper;
import fr.openent.appointments.model.TransactionElement;
import fr.openent.appointments.model.database.TimeSlot;
import fr.openent.appointments.model.payload.TimeSlotPayload;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.repository.TimeSlotRepository;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import org.entcore.common.sql.Sql;
import org.entcore.common.sql.SqlResult;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.SqlTables.*;

/**
 * Default implementation of the TimeSlotRepository interface.
 */
public class DefaultTimeSlotRepository implements TimeSlotRepository {

    private final Sql sql;

    public DefaultTimeSlotRepository(RepositoryFactory repositoryFactory) {
        this.sql = repositoryFactory.sql();
    }

    @Override
    public Future<List<TimeSlot>> create(Long gridId, List<TimeSlotPayload> timeSlots) {
        Promise<List<TimeSlot>> promise = Promise.promise();

        if (timeSlots == null || timeSlots.isEmpty()) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        List<String> sqlColumns = Arrays.asList(GRID_ID, BEGIN_DATE, END_DATE);
        String query = "INSERT INTO "+ DB_TIME_SLOT_TABLE + " (" + String.join(", ", sqlColumns) + ") " +
                "VALUES " + Sql.listPrepared(sqlColumns) + " RETURNING *";

        List<TransactionElement> transactionElements = new ArrayList<>();
        timeSlots.forEach(timeSlot -> {
            JsonArray params = new JsonArray()
                .add(gridId)
                .add(DateHelper.formatDateTime(timeSlot.getBegin()))
                .add(DateHelper.formatDateTime(timeSlot.getEnd()));

            transactionElements.add(new TransactionElement(query, params));
        });

        String errorMessage = "[Appointments@DefaultTimeSlotRepository::create] Fail to insert time slots : ";
        TransactionHelper.executeTransactionAndGetJsonObjectResults(transactionElements, errorMessage)
            .onSuccess(result -> promise.complete(IModelHelper.toList(result, TimeSlot.class)))
            .onFailure(promise::fail);

        return promise.future();
    }

    @Override
    public Future<JsonArray> getLastAppointmentDateByGridOwner(String userId, List<String> ownersIds) {
        Promise<JsonArray> promise = Promise.promise();

        if (ownersIds == null || ownersIds.isEmpty()) {
            promise.complete(new JsonArray());
            return promise.future();
        }

        String query =
                // First we rank every timeslot (by owner) matching our filtering
                "WITH ranked_timeslots AS ( " +
                    "SELECT ts.end_date, g.owner_id, ROW_NUMBER() OVER (PARTITION BY g.owner_id ORDER BY ts.end_date DESC) AS row_num " +
                    "FROM " + DB_TIME_SLOT_TABLE + " ts " +
                    "JOIN " + DB_GRID_TABLE + " g ON ts.grid_id = g.id " +
                    "JOIN " + DB_APPOINTMENT_TABLE + " a ON a.time_slot_id = ts.id " +
                    "WHERE g.owner_id IN " + Sql.listPrepared(ownersIds) +
                    "AND g.state = ? " +
                    "AND a.state = ? " +
                    "AND a.requester_id = ? " +
                    "AND ts.end_date < NOW() " +
                ") " +
                // Then we just pick the first ranked lines (ie the later appointment dates for each owner)
                "SELECT " + END_DATE + ", " + OWNER_ID + " FROM ranked_timeslots " +
                "WHERE row_num = 1" +
                "ORDER BY " + END_DATE + " DESC;";

        JsonArray params = new JsonArray()
                .addAll(ownersIds.stream().collect(JsonArray::new, JsonArray::add, JsonArray::addAll))
                .add(GridState.OPEN)
                .add(AppointmentState.ACCEPTED)
                .add(userId);

        String errorMessage = "[Appointments@DefaultTimeSlotRepository::getLastAppointmentDateByGridOwner] Fail to get last appointment date for grid owners : " + ownersIds;
        sql.prepared(query, params, SqlResult.validResultHandler(FutureHelper.handlerEither(promise, errorMessage)));


        return promise.future();
    }
}
