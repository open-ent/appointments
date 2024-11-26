package fr.openent.appointments.service;

import fr.openent.appointments.config.AppConfig;
import fr.openent.appointments.repository.TimeSlotRepository;
import fr.openent.appointments.service.impl.DefaultTimeSlotService;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;

import fr.openent.appointments.service.impl.DefaultGridService;
import fr.openent.appointments.service.impl.DefaultCommunicationService;
import fr.openent.appointments.repository.RepositoryFactory;

public class ServiceFactory {

    private final Vertx vertx;
    private final AppConfig appConfig;
    private final TimeSlotService timeSlotService;
    private final GridService gridService;
    private final CommunicationService communicationService;

    public ServiceFactory(Vertx vertx, AppConfig appConfig, RepositoryFactory repositoryFactory) {
        this.vertx = vertx;
        this.appConfig = appConfig;
        this.timeSlotService = new DefaultTimeSlotService(this, repositoryFactory);
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

    public TimeSlotService timeSlotService() {
        return this.timeSlotService;
    }

    public GridService gridService() {
        return this.gridService;
    }

    public CommunicationService communicationService() {
        return this.communicationService;
    }
    
}
