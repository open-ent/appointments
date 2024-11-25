package fr.openent.appointments.repository.impl;

import fr.openent.appointments.helper.DateHelper;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.SqlTables.*;

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
}
