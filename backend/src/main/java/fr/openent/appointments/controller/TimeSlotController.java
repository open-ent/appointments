package fr.openent.appointments.controller;

import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.security.ViewRight;
import fr.openent.appointments.service.*;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.user.UserUtils;

import java.time.LocalDate;
import java.util.Optional;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.Fields.ERROR;

public class TimeSlotController extends ControllerHelper {
    private final TimeSlotService timeslotService;

    public TimeSlotController(ServiceFactory serviceFactory) {
        this.timeslotService = serviceFactory.timeSlotService();
    }

    @Get("/grids/:gridId/timeslots")
    @ApiDoc("Get the available timeslots of a grid between two dates")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type= ActionType.RESOURCE)
    public void getTimeSlotsByDates(final HttpServerRequest request) {
        Long gridId = Optional.ofNullable(request.getParam(CAMEL_GRID_ID))
                .map(Long::parseLong)
                .orElse(null);

        if (gridId == null) {
            String errorMessage = "Missing grid id";
            LogHelper.logError(this, "getTimeSlotsByDates", errorMessage);
            badRequest(request);
            return;
        }

        LocalDate beginDate = Optional.ofNullable(request.params().get(CAMEL_BEGIN_DATE))
                .map(DateHelper::parseDate)
                .orElse(null);

        LocalDate endDate = Optional.ofNullable(request.params().get(CAMEL_END_DATE))
                .map(DateHelper::parseDate)
                .orElse(null);

        if (beginDate != null && endDate != null && beginDate.isAfter(endDate)) {
            String errorMessage = "beginDate cannot be after endDate";
            LogHelper.logError(this, "getTimeSlotsByDates", errorMessage);
            badRequest(request);
            return;
        }

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> timeslotService.getAvailableTimeSlotsByDates(user, gridId, beginDate, endDate))
            .onSuccess(timeslotsAvailableResponse -> renderJson(request, timeslotsAvailableResponse.toJson()))
            .onFailure(err -> {
                String errorMessage = String.format("Failed to get available timeslots of grid %s between %s and %s ", gridId, beginDate, endDate);
                LogHelper.logError(this, "getTimeSlotsByDates", errorMessage, err.getMessage());
                renderError(request, new JsonObject().put(ERROR, errorMessage));
            });
    }
}