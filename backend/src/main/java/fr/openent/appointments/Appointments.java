package fr.openent.appointments;

import fr.openent.appointments.controller.MainController;
import fr.openent.appointments.controller.GridController;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.service.ServiceFactory;
import fr.openent.appointments.controller.CommunicationController;
import io.vertx.core.eventbus.EventBus;
import org.entcore.common.sql.Sql;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.http.BaseServer;

public class Appointments extends BaseServer {

    @Override
    public void start() throws Exception {
        super.start();

        EventBus eb = getEventBus(vertx);

        final Sql sql = Sql.getInstance();
        final Neo4j neo4j = Neo4j.getInstance();

        RepositoryFactory repositoryFactory = new RepositoryFactory(sql, neo4j);
        ServiceFactory serviceFactory = new ServiceFactory(vertx, repositoryFactory);

        addController(new MainController());
        addController(new GridController(serviceFactory));
        addController(new CommunicationController(serviceFactory));
    }
}