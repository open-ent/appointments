package fr.openent.appointments.service.impl;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.AppointmentWithInfos;
import fr.openent.appointments.model.database.NeoUser;
import fr.openent.appointments.model.response.ListAppointmentsResponse;
import fr.openent.appointments.model.response.MinimalAppointment;
import fr.openent.appointments.repository.AppointmentRepository;
import fr.openent.appointments.repository.CommunicationRepository;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.service.AppointmentService;
import fr.openent.appointments.service.ServiceFactory;
import fr.openent.appointments.service.TimeSlotService;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.EventBus;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;
import fr.openent.appointments.helper.FutureHelper;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletionStage;
import java.util.stream.Collectors;

public class DefaultAppointmentService implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final CommunicationRepository communicationRepository;
    private final TimeSlotService timeSlotService;

    public DefaultAppointmentService(ServiceFactory serviceFactory, RepositoryFactory repositoryFactory) {
        this.appointmentRepository = repositoryFactory.appointmentRepository();
        this.communicationRepository = repositoryFactory.communicationRepository();
        this.timeSlotService = serviceFactory.timeSlotService();
    }

    @Override
    public Future<Boolean> checkIfUserCanAccessTimeSlot(Long timeSlotId, String userId, List<String> userGroupsIds) {
        return timeSlotService.checkIfUserCanAccessTimeSlot(timeSlotId, userId, userGroupsIds);
    }

    @Override
    public Future<Boolean> checkIfTimeSlotIsAvailable(Long timeSlotId) {
        return timeSlotService.checkIfTimeSlotIsAvailable(timeSlotId);
    }

    @Override
    public Future<Appointment> create(Long timeSlotId, String userId, Boolean isVideoCall) {

        Promise<Appointment> promise = Promise.promise();

        timeSlotService.checkIfTimeSlotIsVideoCall(timeSlotId)
            .compose(isVideoCallTimeSlot -> {
                if (isVideoCall && !isVideoCallTimeSlot) {
                        String errorMessage = "The grid linked to the time slot does not allow video call";
                        LogHelper.logError(this, "create", errorMessage, "");
                }
                return appointmentRepository.create(timeSlotId, userId, isVideoCallTimeSlot && isVideoCall);
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

    private Future<MinimalAppointment> buildMinimalAppointment(AppointmentWithInfos appointment, UserInfos userInfos) {
        Promise<MinimalAppointment> promise = Promise.promise();

        Boolean isRequester = appointment.getRequesterId().equals(userInfos.getUserId());
        String otherUserId = isRequester ? appointment.getOwnerId() : appointment.getRequesterId();
        communicationRepository.getUserFromId(otherUserId, userInfos.getStructures())
                .onSuccess(user -> {
                    if (user.isPresent()) {
                        NeoUser otherUser = user.get();
                        promise.complete(new MinimalAppointment(appointment, isRequester, otherUser.getDisplayName(), otherUser.getFunctions(), otherUser.getPicture()));
                    }
                })
                .onFailure(err -> {
                    String errorMessage = "Failed to build minimal appointment";
                    LogHelper.logError(this, "buildMinimalAppointment", errorMessage, err.getMessage());
                    promise.complete(null);
                });

        return promise.future();
    }

    private ListAppointmentsResponse buildListAppointmentsResponse(CompositeFuture minimalAppointments, Long total) {
        List<MinimalAppointment> minimalAppointmentsList = minimalAppointments.list();
        List<MinimalAppointment> filteredAppointments = minimalAppointmentsList.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return new ListAppointmentsResponse(total, filteredAppointments);
    }

    private void composeAllAppointmentsFuture(List<AppointmentWithInfos> appointments, UserInfos userInfos, Promise<ListAppointmentsResponse> promise, Long total) {
        Future.all(appointments.stream()
                .map(appointment -> buildMinimalAppointment(appointment, userInfos))
                .collect(Collectors.toList()))
                .onSuccess(minimalAppointments -> promise.complete(buildListAppointmentsResponse(minimalAppointments, total)))
                .onFailure(err -> {
                    String errorMessage = "Failed to get my appointments";
                    LogHelper.logError(this, "getMyAppointments", errorMessage, err.getMessage());
                    promise.fail(err);
                });
    }

    @Override
    public Future<ListAppointmentsResponse> getMyAppointments(UserInfos userInfos, List<AppointmentState> states, Long page, Long limit){

        Promise<ListAppointmentsResponse> promise = Promise.promise();

        appointmentRepository.getAppointments(userInfos.getUserId(), states, true)
            .onSuccess(appointments -> {
                Long total = (long) appointments.size();
                if (page != null && limit != null) {
                    appointments = appointments.stream()
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .collect(Collectors.toList());
                }

                composeAllAppointmentsFuture(appointments, userInfos, promise, total);
            })
            .onFailure(err -> {
                String errorMessage = "Failed to get my appointments";
                LogHelper.logError(this, "getMyAppointments", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }
}
