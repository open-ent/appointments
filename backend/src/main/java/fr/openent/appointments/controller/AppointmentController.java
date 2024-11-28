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
import org.joda.time.DateTime;

import java.time.DateTimeException;
import java.util.Optional;

import static fr.openent.appointments.core.constants.Constants.CAMEL_TIME_SLOT_ID;
import static fr.openent.appointments.core.constants.Constants.CAMEL_USER_INFO;

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

        final JsonObject composeInfo = new JsonObject();

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> {
                composeInfo.put(CAMEL_USER_INFO, user);
                return appointmentService.create(timeSlotId, user.getUserId(), user.getGroupsIds());
            })
            .recover(err -> {
                String errorMessage = "Failed to create appointment";
                LogHelper.logError(this, "createAppointment", errorMessage, err.getMessage());
                conflict(request);
                return Future.failedFuture(err);
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
            });
    }
}