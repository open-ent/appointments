package fr.openent.appointments.service;

import fr.openent.appointments.config.AppConfig;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;

import fr.openent.appointments.service.impl.DefaultGridService;
import fr.openent.appointments.service.impl.DefaultCommunicationService;
import fr.openent.appointments.repository.RepositoryFactory;

public class ServiceFactory {

    private final Vertx vertx;
    private final AppConfig appConfig;
    private final GridService gridService;
    private final CommunicationService communicationService;

    public ServiceFactory(Vertx vertx, AppConfig appConfig, RepositoryFactory repositoryFactory) {
        this.vertx = vertx;
        this.appConfig = appConfig;
        this.gridService = new DefaultGridService(this, repositoryFactory);
        this.communicationService = new DefaultCommunicationService(this, repositoryFactory);
    }

    public Vertx vertx() {
        return this.vertx;
    }

    public EventBus eventBus() {
        return this.vertx.eventBus();
    }

    public AppConfig appConfig() {
        return this.appConfig;
    }

    public GridService gridService() {
        return this.gridService;
    }

    public CommunicationService communicationService() {
        return this.communicationService;
    }
    
}
