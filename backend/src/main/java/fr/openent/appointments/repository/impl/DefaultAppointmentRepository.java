package fr.openent.appointments.repository.impl;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.database.Appointment;
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

public class DefaultAppointmentRepository implements AppointmentRepository {

    private final Sql sql;

    public DefaultAppointmentRepository(RepositoryFactory repositoryFactory) {
        this.sql = repositoryFactory.sql();
    }

    @Override
    public Future<Optional<Appointment>> create(Long timeSlotId, String userId) {
        Promise<Optional<Appointment>> promise = Promise.promise();

        if (timeSlotId == null) {
            promise.complete(Optional.empty());
            return promise.future();
        }

        List<String> sqlColumns = Arrays.asList(TIME_SLOT_ID, REQUESTER_ID, STATE);
        String query = "INSERT INTO " + DB_APPOINTMENT_TABLE + " (" + String.join(", ", sqlColumns) + ") " +
                "VALUES " + Sql.listPrepared(sqlColumns) + " RETURNING *";

        JsonArray params = new JsonArray()
                .add(timeSlotId)
                .add(userId)
                .add(AppointmentState.CREATED.getValue());

        String errorMessage = "[Appointemnts@DefaultAppointmentRepository::create] Failed to create appointment : ";
        sql.prepared(query, params, SqlResult.validUniqueResultHandler(IModelHelper.sqlUniqueResultToIModel(promise, Appointment.class, errorMessage)));
        return promise.future();
    }

    @Override
    public Future<List<Appointment>> getAvailableAppointments(Long timeSlotId){
        Promise<List<Appointment>> promise = Promise.promise();

        if (timeSlotId == null) {
            promise.complete(new ArrayList<>());
            return promise.future();
        }

        List<String> availableStates = Arrays.asList(AppointmentState.CREATED.getValue(), AppointmentState.ACCEPTED.getValue());

        String query = "SELECT * FROM " + DB_APPOINTMENT_TABLE + " WHERE " + TIME_SLOT_ID + " = ? AND " + STATE + " IN " + Sql.listPrepared(availableStates);

        JsonArray params = new JsonArray()
                .add(timeSlotId)
                .addAll(new JsonArray(availableStates));

        String errorMessage = "[Appointemnts@DefaultAppointmentRepository::getAvailableAppointments] Failed to get available appointments : ";
        sql.prepared(query, params, SqlResult.validResultHandler(IModelHelper.sqlResultToIModel(promise, Appointment.class, errorMessage)));

        return promise.future();
    }

}
