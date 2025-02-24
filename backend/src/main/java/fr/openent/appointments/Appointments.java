package fr.openent.appointments;

import fr.openent.appointments.config.AppConfig;
import fr.openent.appointments.controller.*;
import fr.openent.appointments.cron.ClosingCron;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.cron.CronTrigger;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.Promise;
import org.entcore.common.events.EventStore;
import org.entcore.common.events.EventStoreFactory;
import org.entcore.common.notification.TimelineHelper;
import org.entcore.common.sql.Sql;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.http.BaseServer;

public class Appointments extends BaseServer {

    @Override
    public void start(Promise<Void> startPromise) throws Exception {
        super.start(startPromise);

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

        // Controller
        addController(new MainController(serviceFactory));
        addController(new GridController(serviceFactory));
        addController(new TimeSlotController(serviceFactory));
        addController(new CommunicationController(serviceFactory));
        addController(new AppointmentController(serviceFactory));

        // CRON
        ClosingCron closingCron = new ClosingCron(serviceFactory);
        new CronTrigger(vertx, appConfig.closingCron()).schedule(closingCron);

        startPromise.tryComplete();
		startPromise.tryFail("[Appointments@Appointments::start] Fail to start Appointments");
    }
}