package fr.openent.appointments.controller;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.helper.ParamHelper;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.response.MinimalAppointment;
import fr.openent.appointments.security.ManageRight;
import fr.openent.appointments.security.ViewRight;
import fr.openent.appointments.service.AppointmentService;
import fr.openent.appointments.service.GridService;
import fr.openent.appointments.service.NotifyService;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.events.EventStore;
import org.entcore.common.http.filter.IgnoreCsrf;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.enums.Events.CREATE;

public class AppointmentController extends ControllerHelper {
    private final EventStore eventStore;
    private final AppointmentService appointmentService;
    private final GridService gridService;
    private final NotifyService notifyService;

    public AppointmentController(ServiceFactory serviceFactory) {
        this.eventStore = serviceFactory.eventStore();
        this.appointmentService = serviceFactory.appointmentService();
        this.gridService = serviceFactory.gridService();
        this.notifyService = serviceFactory.notifyService();
    }

    @Post("/appointments/:timeSlotId")
    @ApiDoc("Create an appointment linked to a time slot")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    @IgnoreCsrf
    public void createAppointment(final HttpServerRequest request) {
        Long timeSlotId = ParamHelper.getParam(CAMEL_TIME_SLOT_ID, request, Long.class, true, "createAppointment");
        if(request.response().ended()) return;

        boolean isVideoCall = Boolean.TRUE.equals(ParamHelper.getParam(CAMEL_IS_VIDEO_CALL, request, Boolean.class, false, "createAppointment"));
        if(request.response().ended()) return;

        final JsonObject composeInfo = new JsonObject();

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> {
                composeInfo.put(CAMEL_USER_INFO, user);
                return appointmentService.checkIfUserCanAccessTimeSlot(timeSlotId, user.getUserId(), user.getGroupsIds());
            })
            .compose(canAccess -> {
                if (!canAccess) {
                    String errorMessage = "User cannot access this time slot";
                    LogHelper.logError(this, "createAppointment", errorMessage);
                    forbidden(request, errorMessage);
                    return Future.failedFuture(errorMessage);
                }
                return appointmentService.checkIfTimeSlotIsAvailable(timeSlotId);
            })
            .compose(isAvailable -> {
                if (!isAvailable) {
                    String errorMessage = "Time slot is not available";
                    LogHelper.logError(this, "createAppointment", errorMessage);
                    conflict(request, errorMessage);
                    return Future.failedFuture(errorMessage);
                }
                UserInfos user = (UserInfos) composeInfo.getValue(CAMEL_USER_INFO);
                return appointmentService.create(timeSlotId, user.getUserId(), isVideoCall);
            })
            .recover(err -> {
                String errorMessage = "Failed to create appointment";
                LogHelper.logError(this, "createAppointment", errorMessage, err.getMessage());
                renderError(request);
                return Future.failedFuture(errorMessage);
            })
            .compose(appointment -> {
                composeInfo.put(CAMEL_APPOINTMENT_ID, appointment.getId());
                eventStore.createAndStoreEvent(CREATE.name(), request, new JsonObject().put(KEBAB_RESOURCE_TYPE, APPOINTMENT));
                renderJson(request, appointment.toJson());
                return gridService.getGridByTimeSlotId(timeSlotId);
            })
            .recover(err -> {
                String errorMessage = "Failed to get grid in order to notify";
                LogHelper.logError(this, "createAppointment", errorMessage, err.getMessage());
                return Future.failedFuture(err);
            })
            .onSuccess(grid -> {
                UserInfos user = (UserInfos) composeInfo.getValue(CAMEL_USER_INFO);
                String targetUserId = grid.getOwnerId();
                Long appointmentId = composeInfo.getLong(CAMEL_APPOINTMENT_ID, null);
                notifyService.notifyNewAppointment(request, user, targetUserId, appointmentId);
            })
            .onFailure(err -> {
                String errorMessage = "Failed to create appointment";
                LogHelper.logError(this, "createAppointment", errorMessage, err.getMessage());
                if(!request.response().ended()) renderError(request, new JsonObject().put(ERROR, errorMessage));
            });
    }

    @Get("/appointments")
    @ApiDoc("Get my appointments with filters")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    public void getMyAppointments(final HttpServerRequest request) {
        Long page = ParamHelper.getParam(PAGE, request, Long.class, false, "getMyAppointments");
        if(request.response().ended()) return;

        Long limit = ParamHelper.getParam(LIMIT, request, Long.class, false, "getMyAppointments");
        if(request.response().ended()) return;

        List<AppointmentState> states;
        String statesParam = request.params().get(STATES);
        if (statesParam != null && !statesParam.isEmpty()) {
            states = new JsonArray(statesParam).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .map(AppointmentState::getAppointmentState)
                    .collect(Collectors.toList());
        } else {
            states = new ArrayList<>();
        }

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user-> appointmentService.getMyAppointments(user, states, page, limit))
            .onSuccess(appointments -> renderJson(request, appointments.toJson()))
            .onFailure(err -> {
                String errorMessage = "Failed to get my appointments";
                LogHelper.logError(this, "getMyAppointments", errorMessage, err.getMessage());
                renderError(request);
            });
    }

    @Get("appointments/:appointmentId")
    @ApiDoc("Get an appointment by its id")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    public void getAppointmentById(final HttpServerRequest request) {
        Long appointmentId = ParamHelper.getParam(CAMEL_APPOINTMENT_ID, request, Long.class, true, "getAppointmentById");
        if(request.response().ended()) return;

        UserUtils.getAuthenticatedUserInfos(eb, request)
                .compose(user -> appointmentService.getAppointmentById(appointmentId, user))
                .onSuccess(appointment -> renderJson(request, appointment.toJson()))
                .onFailure(err -> {
                    String errorMessage = "Failed to get appointment by id";
                    LogHelper.logError(this, "getAppointmentById", errorMessage, err.getMessage());
                    renderError(request);
                });
    }

    private void handleAppointmentAction(final HttpServerRequest request,
                                         String action,
                                         AppointmentActionHandler actionHandler) {
        Long appointmentId = ParamHelper.getParam(CAMEL_APPOINTMENT_ID, request, Long.class, true, action + "Appointment");
        if(request.response().ended()) return;

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> actionHandler.handle(request, appointmentId, user))
            .onSuccess(appointment -> renderJson(request, appointment.toJson()))
            .onFailure(err -> {
                String errorMessage = "Failed to " + action + " appointment";
                LogHelper.logError(this, action+"Appointment", errorMessage, err.getMessage());
                renderError(request);
            });
    }

    interface AppointmentActionHandler {
        Future<Appointment> handle(final HttpServerRequest request, Long appointmentId, UserInfos userInfos);
    }

    @Put("appointments/:appointmentId/accept")
    @ApiDoc("Accept an appointment")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    @IgnoreCsrf
    public void acceptAppointment(final HttpServerRequest request) {
        handleAppointmentAction(request, "accept", appointmentService::acceptAppointment);
    }

    @Put("appointments/:appointmentId/reject")
    @ApiDoc("Reject an appointment")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    @IgnoreCsrf
    public void rejectAppointment(final HttpServerRequest request) {
        handleAppointmentAction(request, "reject", appointmentService::rejectAppointment);
    }

    @Put("appointments/:appointmentId/cancel")
    @ApiDoc("Cancel an appointment")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    @IgnoreCsrf
    public void cancelAppointment(final HttpServerRequest request) {
        handleAppointmentAction(request, "cancel", appointmentService::cancelAppointment);
    }

    @Get("appointments/dates")
    @ApiDoc("Get appointments dates")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getAppointmentsDates(final HttpServerRequest request) {
        List<AppointmentState> states;
        String statesParam = request.params().get(STATES);
        if (statesParam != null && !statesParam.isEmpty()) {
            states = new JsonArray(statesParam).stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .map(AppointmentState::getAppointmentState)
                .collect(Collectors.toList());
        } else {
            states = new ArrayList<>();
        }

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user ->appointmentService.getAppointmentsDates(user.getUserId(), states))
            .onSuccess(dates -> renderJson(request, new JsonArray(dates.stream().map(DateHelper::formatDate).collect(Collectors.toList()))))
            .onFailure(err -> {
                String errorMessage = "Failed to get appointments dates";
                LogHelper.logError(this, "getAppointmentsDates", errorMessage, err.getMessage());
                renderError(request);
            });
    }

    @Get("appointments/:appointmentId/index")
    @ApiDoc("Get appointment index in front list in order to make front animation when user click on url present in notification")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    public void getAppointmentIndexInFrontList(final HttpServerRequest request) {
        Long appointmentId = ParamHelper.getParam(CAMEL_APPOINTMENT_ID, request, Long.class, true, "getAppointmentIndexInFrontList");
        if(request.response().ended()) return;

        JsonObject composeInfo = new JsonObject();

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> {
                composeInfo.put(CAMEL_USER_INFO, user);
                return appointmentService.getAppointmentById(appointmentId, user);
            })
            .compose(appointmentResponse -> {
                UserInfos user = (UserInfos) composeInfo.getValue(CAMEL_USER_INFO);
                AppointmentState appointmentState = appointmentResponse.getState();
                List<AppointmentState> states = appointmentState == AppointmentState.CANCELED || appointmentState == AppointmentState.REFUSED
                    ? Arrays.asList(AppointmentState.CANCELED, AppointmentState.REFUSED)
                    : Collections.singletonList(appointmentState);
                return appointmentService.getMyAppointments(user, states, null, null);
            })
            .onSuccess(listAppointments -> {
                List<MinimalAppointment> appointments = listAppointments.getAppointments();
                int index = IntStream.range(0, appointments.size())
                    .filter(i -> appointments.get(i).getId().equals(appointmentId))
                    .findFirst()
                    .orElse(-1);

                if (index == -1) {
                    String errorMessage = "Appointment not found in list";
                    LogHelper.logError(this, "getSpecialAppointmentInfosById", errorMessage);
                    renderError(request);
                }
                else renderJson(request, new JsonObject().put(INDEX, index));
            })
            .onFailure(err -> {
                String errorMessage = "Failed to get special appointment infos";
                LogHelper.logError(this, "getSpecialAppointmentInfosById", errorMessage, err.getMessage());
                renderError(request);
            });
    }

    @Get("appointments/available/grids/:gridId")
    @ApiDoc("Get available appointments for a grid")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    public void getAvailableAppointmentsForGrid(final HttpServerRequest request) {
        Long gridId = ParamHelper.getParam(CAMEL_GRID_ID, request, Long.class, true, "getAvailableAppointmentsForGrid");
        if(request.response().ended()) return;

        JsonObject composeInfo = new JsonObject();
        gridService.getGridById(gridId)
            .compose(grid -> {
                composeInfo.put(OWNER_ID, grid.getOwnerId());
                return UserUtils.getAuthenticatedUserInfos(eb, request);
            })
            .compose(user -> {
                if(!user.getUserId().equals(composeInfo.getString(OWNER_ID))) {
                    String errorMessage = "User cannot access this grid";
                    LogHelper.logError(this, "getAvailableAppointmentsForGrid", errorMessage);
                    unauthorized(request, errorMessage);
                    return Future.failedFuture(errorMessage);
                }
                return appointmentService.getAcceptedOrCreatedAppointment(gridId);
            })
            .onSuccess(appointments -> renderJson(request, new JsonArray(appointments)))
            .onFailure(err -> {
                String errorMessage = "Failed to get available appointments for grid";
                LogHelper.logError(this, "getAvailableAppointmentsForGrid", errorMessage, err.getMessage());
                renderError(request);
            });
    }
}