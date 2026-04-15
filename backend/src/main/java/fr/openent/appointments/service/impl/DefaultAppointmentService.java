package fr.openent.appointments.service.impl;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.enums.ICS.EventMethod;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.ICS.CalendarICS;
import fr.openent.appointments.model.ICS.EventICS;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.AppointmentWithInfos;
import fr.openent.appointments.model.database.NeoUser;
import fr.openent.appointments.model.response.AppointmentResponse;
import fr.openent.appointments.model.response.DocumentResponse;
import fr.openent.appointments.model.response.ListAppointmentsResponse;
import fr.openent.appointments.model.response.MinimalAppointment;
import fr.openent.appointments.repository.AppointmentRepository;
import fr.openent.appointments.repository.CommunicationRepository;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.service.*;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import org.entcore.common.user.UserInfos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static fr.openent.appointments.core.constants.Constants.CAMEL_COMMENTATOR_USER;
import static fr.openent.appointments.core.constants.Constants.CAMEL_NEO_USER;
import static fr.openent.appointments.core.constants.Fields.*;

public class DefaultAppointmentService implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final CommunicationRepository communicationRepository;
    private final EventBusService eventBusService;
    private final TimeSlotService timeSlotService;
    private final NotifyService notifyService;
    private final Long limitHoursBeforeCancelAppointment;

    public DefaultAppointmentService(ServiceFactory serviceFactory, RepositoryFactory repositoryFactory) {
        this.appointmentRepository = repositoryFactory.appointmentRepository();
        this.communicationRepository = repositoryFactory.communicationRepository();
        this.eventBusService = serviceFactory.eventBusService();
        this.timeSlotService = serviceFactory.timeSlotService();
        this.notifyService = serviceFactory.notifyService();
        this.limitHoursBeforeCancelAppointment = serviceFactory.appConfig().minHoursBeforeCancellation();
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

    private Future<AppointmentResponse> buildAppointmentResponse(AppointmentWithInfos appointment, UserInfos userInfos) {
        Promise<AppointmentResponse> promise = Promise.promise();

        Boolean isRequester = appointment.getRequesterId().equals(userInfos.getUserId());
        String otherUserId = isRequester ? appointment.getOwnerId() : appointment.getRequesterId();

        List<String> attendeesUserIds = Arrays.asList(otherUserId, appointment.getCommentatorId());

        JsonObject composeInfos = new JsonObject();
        communicationRepository.getUsersFromUsersIds(attendeesUserIds, userInfos.getStructures())
            .compose(users -> {
                if (users.isEmpty()) {
                    String errorMessage = "Users not found";
                    LogHelper.logError(this, "buildAppointmentResponse", errorMessage, "");
                    return Future.failedFuture(errorMessage);
                }

                NeoUser otherUser = users.stream().filter(user -> user.getId().equals(otherUserId)).findFirst().orElse(null);
                composeInfos.put(CAMEL_NEO_USER, otherUser);
                NeoUser commentatorUser = users.stream().filter(user -> user.getId().equals(appointment.getCommentatorId())).findFirst().orElse(null);
                composeInfos.put(CAMEL_COMMENTATOR_USER, commentatorUser);
                return eventBusService.getDocumentResponseFromGrid(appointment.getOwnerId(), appointment.getDocumentsIds());
            })
            .onSuccess(documents -> {
                NeoUser otherUser = (NeoUser) composeInfos.getValue(CAMEL_NEO_USER);
                NeoUser commentatorUser = (NeoUser) composeInfos.getValue(CAMEL_COMMENTATOR_USER);
                promise.complete(new AppointmentResponse(appointment, isRequester, otherUser, commentatorUser, documents));
            })
            .onFailure(err -> {
                String errorMessage = "Failed to build appointment response";
                LogHelper.logError(this, "buildAppointmentResponse", errorMessage, err.getMessage());
                promise.complete(null);
            });

        return promise.future();
    }

    @Override
    public Future<AppointmentResponse> getAppointmentById(Long appointmentId, UserInfos userInfos) {
        Promise<AppointmentResponse> promise = Promise.promise();
        appointmentRepository.get(appointmentId)
            .compose(appointmentWithInfos -> {
                if (appointmentWithInfos.isPresent())
                    if (isUserInAppointment(appointmentWithInfos.get(), userInfos.getUserId())) {
                        AppointmentWithInfos appointment = appointmentWithInfos.get();
                        return buildAppointmentResponse(appointment, userInfos);
                    }
                    else {
                        String errorMessage = "User is not in appointment";
                        LogHelper.logError(this, "getAppointmentById", errorMessage);
                        return Future.failedFuture(errorMessage);
                    }
                else {
                    String errorMessage = "Appointment not found";
                    LogHelper.logError(this, "getAppointmentById", errorMessage);
                    return Future.failedFuture(errorMessage);
                }
            })
            .onSuccess(promise::complete)
            .onFailure(err -> {
                String errorMessage = "Failed to get appointment by id";
                LogHelper.logError(this, "getAppointmentById", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();                
    }

    @Override
    public Future<List<AppointmentWithInfos>> getAppointmentsByIds(List<Long> appointmentsIds, String userId, List<AppointmentState> states) {
        Promise<List<AppointmentWithInfos>> promise = Promise.promise();

        appointmentRepository.getAppointments(userId, states, true, appointmentsIds)
            .onSuccess(appointmentWithInfosList -> {
                if (appointmentWithInfosList.isEmpty()) {
                    String errorMessage = "No appointments found";
                    LogHelper.logError(this, "getAppointmentsByIds", errorMessage);
                    promise.fail(errorMessage);
                    return;
                }

                Set<Long> appointmentsIdsInBDD = appointmentWithInfosList.stream()
                        .map(AppointmentWithInfos::getId)
                        .collect(Collectors.toSet());

                if (appointmentsIds.size() > appointmentsIdsInBDD.size()) {
                    String errorMessage = "User is not in one of the requested appointments";
                    LogHelper.logError(this, "getAppointmentsByIds", errorMessage);
                    promise.fail(errorMessage);
                    return;
                }

                promise.complete(appointmentWithInfosList);
            })
            .onFailure(err -> {
                String errorMessage = "Failed to get appointments by ids";
                LogHelper.logError(this, "getAppointmentsByIds", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();                
    }

    private List<LocalDate> buildAppointmentsDates(List<AppointmentWithInfos> appointments) {
        return appointments.stream()
            .map(AppointmentWithInfos::getBeginDate)
            .map(LocalDateTime::toLocalDate)
            .distinct()
            .collect(Collectors.toList());
    }

    @Override
    public Future<List<LocalDate>> getAppointmentsDates(String userId, List<AppointmentState> states) {
        Promise<List<LocalDate>> promise = Promise.promise();

        appointmentRepository.getAppointments(userId, states, true)
            .onSuccess(appointments -> promise.complete(buildAppointmentsDates(appointments)))
            .onFailure(err -> {
                String errorMessage = "Failed to get appointments dates";
                LogHelper.logError(this, "getAppointmentsDates", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    private Boolean isValidAction(AppointmentState currentState, AppointmentState targetState) {
        switch (currentState) {
            case CREATED:
                return  targetState == AppointmentState.ACCEPTED ||
                        targetState == AppointmentState.REFUSED ||
                        targetState == AppointmentState.CANCELED;
            case ACCEPTED:
                return targetState == AppointmentState.CANCELED;
            default:
                return false;
        }
    }

    private Boolean isBeforeLimitHoursAppointment(LocalDateTime beginDate) {
        return LocalDateTime.now().plusHours(limitHoursBeforeCancelAppointment).isBefore(beginDate);
    }

    private Future<Appointment> handleAppointmentStateChange(final HttpServerRequest request,
                                                             Long appointmentId,
                                                             UserInfos userInfos,
                                                             String comment,
                                                             AppointmentState targetState,
                                                             String functionName) {
        Promise<Appointment> promise = Promise.promise();

        JsonObject composeInfos = new JsonObject();

        appointmentRepository.get(appointmentId)
            .compose(appointment -> {
                if (!appointment.isPresent()) {
                    LogHelper.logError(this, functionName, "Appointment not found", "");
                    return Future.failedFuture("Appointment not found");
                }
                AppointmentWithInfos appointmentWithInfos = appointment.get();
                if(!isUserInAppointment(appointmentWithInfos, userInfos.getUserId())) {
                    LogHelper.logError(this, functionName, "User is not in appointment", "");
                    return Future.failedFuture("User is not in appointment");
                }
                AppointmentState currentState = appointmentWithInfos.getState();
                composeInfos.put(STATE, currentState.getValue());
                if ( (targetState == AppointmentState.ACCEPTED || targetState == AppointmentState.REFUSED) && !isOwnerOfAppointment(appointmentWithInfos, userInfos.getUserId())) {
                    String errorMessage = "User is not the owner of the appointment";
                    LogHelper.logError(this, functionName, errorMessage, "");
                    return Future.failedFuture(errorMessage);
                }
                if (targetState == AppointmentState.CANCELED &&
                    currentState == AppointmentState.ACCEPTED &&
                    !isBeforeLimitHoursAppointment(appointmentWithInfos.getBeginDate()))
                {
                    String errorMessage = "Appointment cannot be canceled less than " + limitHoursBeforeCancelAppointment + " hours before";
                    LogHelper.logError(this, functionName, errorMessage, "");
                    return Future.failedFuture(errorMessage);
                }
                if (!isValidAction(currentState, targetState)) {
                    String errorMessage = "Invalid action";
                    LogHelper.logError(this, functionName, errorMessage, "");
                    return Future.failedFuture(errorMessage);
                }
                return appointmentRepository.updateState(appointmentId, targetState, comment, userInfos.getUserId());
            })
            .onSuccess(updatedAppointment -> {
                if (updatedAppointment.isPresent()) {
                    Appointment appointmentUpdated = updatedAppointment.get();
                    promise.complete(appointmentUpdated);
                    AppointmentState previousState = AppointmentState.getAppointmentState((String) composeInfos.getValue(STATE));
                    notifyService.notifyAppointmentUpdate(request, userInfos, previousState, appointmentId);
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
    public Future<List<Appointment>> getAcceptedAppointment(Long gridId) {
        return appointmentRepository.getAppointmentsByGridId(gridId, Collections.singletonList(AppointmentState.ACCEPTED), true);
    }

    @Override
    public Future<List<Appointment>> getAcceptedOrCreatedAppointment(Long gridId) {
        return appointmentRepository.getAppointmentsByGridId(gridId, AppointmentState.getAvailableStatesAsEnum(), true);
    }

    @Override
    public Future<Appointment> acceptAppointment(final HttpServerRequest request, Long appointmentId, UserInfos userInfos, String comment) {
        return handleAppointmentStateChange(request, appointmentId, userInfos, comment, AppointmentState.ACCEPTED, "acceptAppointment");
    }

    @Override
    public Future<Appointment> rejectAppointment(final HttpServerRequest request, Long appointmentId, UserInfos userInfos, String comment) {
        return handleAppointmentStateChange(request, appointmentId, userInfos, comment, AppointmentState.REFUSED, "rejectAppointment");
    }

    @Override
    public Future<Appointment> cancelAppointment(final HttpServerRequest request, Long appointmentId, UserInfos userInfos, String comment) {
        return handleAppointmentStateChange(request, appointmentId, userInfos, comment, AppointmentState.CANCELED, "cancelAppointment");
    }

    @Override
    public Future<String> buildICSFile(List<AppointmentWithInfos> appointments, Map<String, String> mapUserIdToDisplayName, String userId, EventMethod eventMethod) {
        try {
            List<EventICS> events = appointments.stream()
                .map((appointment) -> {
                    String otherMemberId =
                        userId.equals(appointment.getRequesterId())
                        ? appointment.getOwnerId()
                        : appointment.getRequesterId();
                    String otherMemberDisplayName = mapUserIdToDisplayName.getOrDefault(otherMemberId, null);
                    if (otherMemberDisplayName == null) {
                        throw new IllegalStateException("Failed to get displayname from user id " + otherMemberId);
                    }

                    return new EventICS(appointment, otherMemberDisplayName);
                })
                .collect(Collectors.toList());

            CalendarICS calendarICS = new CalendarICS(events, eventMethod);
            return Future.succeededFuture(calendarICS.toICS());
        }
        catch (IllegalStateException e) {
            LogHelper.logError(this, "buildICSFile", e.getMessage());
            return Future.failedFuture(e.getMessage());
        }
    }
}
