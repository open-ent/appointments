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
import org.entcore.common.user.UserInfos;

import java.util.List;
import java.util.Objects;
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
    
    private Boolean isUserInAppointment(AppointmentWithInfos appointment, String userId) {
        return appointment.getRequesterId().equals(userId) || appointment.getOwnerId().equals(userId);
    }

    private Boolean isOwnerOfAppointment(AppointmentWithInfos appointment, String userId) {
        return appointment.getOwnerId().equals(userId);
    }

    @Override
    public Future<AppointmentWithInfos> getAppointmentById(Long appointmentId, String userId){
        Promise<AppointmentWithInfos> promise = Promise.promise();
        appointmentRepository.get(appointmentId)
            .onSuccess(appointmentWithInfos -> {
                if (appointmentWithInfos.isPresent())
                    if (isUserInAppointment(appointmentWithInfos.get(), userId))
                        promise.complete(appointmentWithInfos.get());
                    else {
                        String errorMessage = "User is not in appointment";
                        LogHelper.logError(this, "getAppointmentById", errorMessage, "");
                        promise.fail(errorMessage);
                    }
                else {
                    String errorMessage = "Appointment not found";
                    LogHelper.logError(this, "getAppointmentById", errorMessage, "");
                    promise.fail(errorMessage);
                }
            })
            .onFailure(err -> {
                String errorMessage = "Failed to get appointment by id";
                LogHelper.logError(this, "getAppointmentById", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();                
    }

    @Override
    public Future<Appointment> acceptAppointment(Long appointmentId, String userId) {
        return handleAppointmentStateChange(appointmentId, userId, AppointmentState.ACCEPTED, "acceptAppointment");
    }

    @Override
    public Future<Appointment> rejectAppointment(Long appointmentId, String userId) {
        return handleAppointmentStateChange(appointmentId, userId, AppointmentState.REFUSED, "rejectAppointment");
    }

    private Future<Appointment> handleAppointmentStateChange(Long appointmentId, String userId, AppointmentState targetState, String functionName) {
        Promise<Appointment> promise = Promise.promise();

        appointmentRepository.get(appointmentId)
                .compose(appointment -> {
                    if (!appointment.isPresent()) {
                        LogHelper.logError(this, functionName, "Appointment not found", "");
                        return Future.failedFuture("Appointment not found");
                    }

                    if (!isOwnerOfAppointment(appointment.get(), userId)) {
                        LogHelper.logError(this, functionName, "User is not the owner of the appointment", "");
                        return Future.failedFuture("User is not the owner of the appointment");
                    }

                    if (appointment.get().getState() != AppointmentState.CREATED) {
                        LogHelper.logError(this, functionName, "Appointment is not pending", "");
                        return Future.failedFuture("Appointment is not pending");
                    }

                    return appointmentRepository.updateState(appointmentId, targetState);
                })
                .onSuccess(updatedAppointment -> {
                    if (updatedAppointment.isPresent()) {
                        promise.complete(updatedAppointment.get());
                    } else {
                        LogHelper.logError(this, functionName, "Failed to update appointment", "");
                        promise.fail("Failed to update appointment");
                    }
                })
                .onFailure(err -> {
                    LogHelper.logError(this, functionName, "Failed to update appointment", err.getMessage());
                    promise.fail(err);
                });

        return promise.future();
    }

    @Override
    public Future<Appointment> cancelAppointment(Long appointmentId, UserInfos userInfos){
        // TODO
        return null;
    }

}
