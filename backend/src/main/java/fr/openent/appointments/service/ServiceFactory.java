package fr.openent.appointments.service;

import fr.openent.appointments.config.AppConfig;
import fr.openent.appointments.repository.TimeSlotRepository;
import fr.openent.appointments.service.impl.*;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;

import fr.openent.appointments.repository.RepositoryFactory;
import org.entcore.common.notification.TimelineHelper;

public class ServiceFactory {

    private final Vertx vertx;
    private final AppConfig appConfig;
    private final TimelineHelper timelineHelper;
    private final TimeSlotService timeSlotService;
    private final GridService gridService;
    private final CommunicationService communicationService;
    private final AppointmentService appointmentService;
    private final NotifyService notifyService;

    public ServiceFactory(Vertx vertx, AppConfig appConfig, RepositoryFactory repositoryFactory, TimelineHelper timelineHelper) {
        this.vertx = vertx;
        this.appConfig = appConfig;
        this.timelineHelper = timelineHelper;
        this.timeSlotService = new DefaultTimeSlotService(this, repositoryFactory);
        this.gridService = new DefaultGridService(this, repositoryFactory);
        this.communicationService = new DefaultCommunicationService(this, repositoryFactory);
        this.appointmentService = new DefaultAppointmentService(this, repositoryFactory);
        this.notifyService = new DefaultNotifyService(this);
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

    public TimelineHelper timelineHelper() { return this.timelineHelper; }

    public TimeSlotService timeSlotService() {
        return this.timeSlotService;
    }

    public GridService gridService() {
        return this.gridService;
    }

    public CommunicationService communicationService() {
        return this.communicationService;
    }

    public AppointmentService appointmentService() { return this.appointmentService; }

    public NotifyService notifyService() { return this.notifyService; }
}
