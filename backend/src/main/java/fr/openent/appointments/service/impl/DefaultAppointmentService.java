package fr.openent.appointments.service.impl;

import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.repository.AppointmentRepository;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.service.AppointmentService;
import fr.openent.appointments.service.ServiceFactory;
import fr.openent.appointments.service.TimeSlotService;
import io.vertx.core.Future;
import io.vertx.core.Promise;

import java.util.List;

public class DefaultAppointmentService implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotService timeSlotService;

    public DefaultAppointmentService(ServiceFactory serviceFactory, RepositoryFactory repositoryFactory) {
        this.appointmentRepository = repositoryFactory.appointmentRepository();
        this.timeSlotService = serviceFactory.timeSlotService();
    }

    @Override
    public Future<Appointment> create(Long timeSlotId, String userId, List<String> userGroupsIds) {

        Promise<Appointment> promise = Promise.promise();

        timeSlotService.checkIfUserCanAccessTimeSlot(timeSlotId, userId, userGroupsIds)
            .compose(isAuthorized -> {
                if (!isAuthorized) {
                    String errorMessage = "User is not authorized to access this time slot";
                    return Future.failedFuture(errorMessage);
                }
                return timeSlotService.checkIfTimeSlotIsAvailable(timeSlotId);
            })
            .compose(isAvailable -> {
                if (!isAvailable) {
                    String errorMessage = "Time slot is not available";
                    return Future.failedFuture(errorMessage);
                }
                return appointmentRepository.create(timeSlotId, userId);
            })
            .onSuccess(appointment -> {
                if (!appointment.isPresent()) {
                    String errorMessage = "Error while creating appointment";
                    promise.fail(errorMessage);
                }
                else {
                    promise.complete(appointment.get());
                }
            })
            .onFailure(err -> {
                String errorMessage = "Failed to create appointment";
                LogHelper.logError(this, "create", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }
}
