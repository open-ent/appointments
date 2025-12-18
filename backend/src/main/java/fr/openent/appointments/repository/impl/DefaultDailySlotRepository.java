package fr.openent.appointments.repository.impl;

import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.helper.TransactionHelper;
import fr.openent.appointments.model.TransactionElement;
import fr.openent.appointments.model.database.DailySlot;
import fr.openent.appointments.model.payload.DailySlotPayload;
import fr.openent.appointments.repository.DailySlotRepository;
import fr.openent.appointments.repository.RepositoryFactory;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import org.entcore.common.sql.Sql;
import org.entcore.common.sql.SqlResult;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.SqlTables.DB_DAILY_SLOT_TABLE;

/**
 * Default implementation of the DailySlotRepository interface.
 */
public class DefaultDailySlotRepository implements DailySlotRepository {

    private final Sql sql;

    public DefaultDailySlotRepository(RepositoryFactory repositoryFactory) {
        this.sql = repositoryFactory.sql();
    }

    @Override
    public Future<List<DailySlot>> create(Long gridId, List<DailySlotPayload> dailySlots) {
        Promise<List<DailySlot>> promise = Promise.promise();

        if (dailySlots == null || dailySlots.isEmpty()) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        List<String> sqlColumns = Arrays.asList(GRID_ID, DAY, BEGIN_TIME, END_TIME);
        String query = "INSERT INTO "+ DB_DAILY_SLOT_TABLE + " (" + String.join(", ", sqlColumns) + ") " +
                "VALUES " + Sql.listPrepared(sqlColumns) + " RETURNING *";

        List<TransactionElement> transactionElements = new ArrayList<>();

        dailySlots.forEach(dailySlot -> {
            JsonArray params = new JsonArray()
                    .add(gridId)
                    .add(dailySlot.getDay().getValue())
                    .add(DateHelper.formatTime(dailySlot.getBeginTime()))
                    .add(DateHelper.formatTime(dailySlot.getEndTime()));

            transactionElements.add(new TransactionElement(query, params));
        });

        String errorMessage = "[Appointments@DefaultDailySlotRepository::create] Fail to create daily slots : ";
        TransactionHelper.executeTransactionAndGetJsonObjectResults(transactionElements, errorMessage)
            .onSuccess(result -> promise.complete(IModelHelper.toList(result, DailySlot.class)))
            .onFailure(promise::fail);

        return promise.future();
    }

    @Override
    public Future<List<DailySlot>> getByGridId(Long gridId) {
        Promise<List<DailySlot>> promise = Promise.promise();

        String query = "SELECT * FROM " + DB_DAILY_SLOT_TABLE + " WHERE " + GRID_ID + " = ?";

        JsonArray params = new JsonArray().add(gridId);

        String errorMessage = String.format("[Appointments@DefaultDailySlotRepository::getByGridId] Fail to get daily slots by grid id %s : ", gridId);
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, DailySlot.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<DailySlot>> removeByGridId(Long gridId){
        Promise<List<DailySlot>> promise = Promise.promise();

        String query = "DELETE FROM " + DB_DAILY_SLOT_TABLE +
                       " WHERE " + GRID_ID + " = ? RETURNING *";

        JsonArray params = new JsonArray().add(gridId);

        String errorMessage = String.format("[Appointments@DefaultDailySlotRepository::removeByGridId] Fail to delete daily slots by grid id %s : ", gridId);
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.resultToIModel(promise, DailySlot.class, errorMessage)));

        return promise.future();
    }
}
