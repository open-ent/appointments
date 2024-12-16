package fr.openent.appointments.controller;

import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.security.ViewRight;
import fr.openent.appointments.service.AppointmentService;
import fr.openent.appointments.service.GridService;
import fr.openent.appointments.service.NotifyService;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Post;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;
import java.util.Optional;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.Fields.ERROR;

public class AppointmentController extends ControllerHelper {
    private final AppointmentService appointmentService;
    private final GridService gridService;
    private final NotifyService notifyService;

    public AppointmentController(ServiceFactory serviceFactory) {
        this.appointmentService = serviceFactory.appointmentService();
        this.gridService = serviceFactory.gridService();
        this.notifyService = serviceFactory.notifyService();
    }

    @Post("/appointments/:timeSlotId")
    @ApiDoc("Create an appointment linked to a time slot")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    public void createAppointment(final HttpServerRequest request) {
        Long timeSlotId = Optional.ofNullable(request.getParam(CAMEL_TIME_SLOT_ID))
                .map(Long::parseLong)
                .orElse(null);

        if (timeSlotId == null) {
            String errorMessage = "Missing time slot id";
            LogHelper.logError(this, "createAppointment", errorMessage);
            badRequest(request);
            return;
        }

        boolean isVideoCall = Optional.ofNullable(request.getParam(CAMEL_IS_VIDEO_CALL))
                .map(Boolean::parseBoolean)
                .orElse(false);

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
                notifyService.notifyNewAppointment(request, user, targetUserId);
            })
            .onFailure(err -> {
                String errorMessage = "Failed to create appointment";
                LogHelper.logError(this, "createAppointment", errorMessage, err.getMessage());
                if(!request.isEnded()) renderError(request, new JsonObject().put(ERROR, errorMessage));
            });
    }
}