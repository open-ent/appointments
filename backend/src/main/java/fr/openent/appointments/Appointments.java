package fr.openent.appointments;

import fr.openent.appointments.config.AppConfig;
import fr.openent.appointments.controller.*;
import fr.openent.appointments.cron.ClosingCron;
import fr.openent.appointments.eventbus.WorkflowHubGateway;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.cron.CronTrigger;
import io.vertx.core.Future;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.Promise;
import org.entcore.common.events.EventStore;
import org.entcore.common.events.EventStoreFactory;
import org.entcore.common.notification.TimelineHelper;
import org.entcore.common.share.impl.SqlShareService;
import org.entcore.common.sql.Sql;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.http.BaseServer;
import org.entcore.common.sql.SqlConf;
import org.entcore.common.sql.SqlConfs;

import java.text.ParseException;
import static fr.openent.appointments.core.constants.SqlTables.*;

public class Appointments extends BaseServer {

    @Override
    public void start(Promise<Void> startPromise) throws Exception {
        final Promise<Void> promise = Promise.promise();
        super.start(promise);
        promise.future().compose(init -> initAppointments()).onComplete(startPromise);
    }

    public Future<Void> initAppointments() {
        EventBus eb = getEventBus(vertx);
        EventStore eventStore = EventStoreFactory.getFactory().getEventStore(Appointments.class.getSimpleName());
        AppConfig appConfig = new AppConfig(config);
        TimelineHelper timelineHelper = new TimelineHelper(vertx, eb, config);

        // BDD
        final Sql sql = Sql.getInstance();
        final Neo4j neo4j = Neo4j.getInstance();

        // Factory
        RepositoryFactory repositoryFactory = new RepositoryFactory(sql, neo4j);
        ServiceFactory serviceFactory = new ServiceFactory(vertx, eventStore, appConfig, repositoryFactory, timelineHelper);

        // Create and parameter conf for all controllers using sharing system (only the SharingController for now)
        SqlConf sharingConf = SqlConfs.createConf(SharingController.class.getName());
        sharingConf.setSchema(DB_SCHEMA);
        sharingConf.setTable(GRID_TABLE);
        sharingConf.setShareTable(GRID_SHARES_TABLE);

        // Set sharing service
        SharingController sharingController = new SharingController(serviceFactory);
        SqlShareService sqlShareService = new SqlShareService(DB_SCHEMA, GRID_SHARES_TABLE, eb, securedActions, null);
        sharingController.setShareService(sqlShareService);

        // Controller
        addController(new MainController(serviceFactory));
        addController(new GridController(serviceFactory));
        addController(new TimeSlotController(serviceFactory));
        addController(new CommunicationController(serviceFactory));
        addController(new AppointmentController(serviceFactory));
        addController(sharingController);

        // Bus applicatif : sert les grilles/créneaux d'un enseignant et réserve un rendez-vous
        // au nom d'un module tiers déjà authentifié (WorkflowHub — démarche « Demande de
        // rendez-vous avec un enseignant »). Cf. WorkflowHubGateway pour le contrat.
        new WorkflowHubGateway(serviceFactory).register(eb);

        // CRON
        ClosingCron closingCron = new ClosingCron(serviceFactory);
        // Enable closing passed grid task to be triggered via API
        addController(new TaskController(closingCron));
        // Schedule closing passed grid task from cron expression
        if (appConfig.closingCron() != null && !appConfig.closingCron().isEmpty()) {
            try {
                new CronTrigger(vertx, appConfig.closingCron()).schedule(closingCron);
            } catch (ParseException e) {
                return Future.failedFuture(e);
            }
        }
        return Future.succeededFuture();
    }
}