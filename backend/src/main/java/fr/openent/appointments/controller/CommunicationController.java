package fr.openent.appointments.controller;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.security.ViewRight;
import fr.openent.appointments.service.CommunicationService;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.security.ActionType;
import fr.wseduc.webutils.http.BaseController;
import io.vertx.core.Future;
import org.entcore.common.http.filter.ResourceFilter;
import io.vertx.core.http.HttpServerRequest;
import fr.openent.appointments.security.ManageRight;
import org.entcore.common.user.UserUtils;

import java.util.Optional;

import static fr.openent.appointments.core.constants.Constants.*;


public class CommunicationController extends BaseController {
    private final CommunicationService communicationService;

    public CommunicationController(ServiceFactory serviceFactory) {
        this.communicationService = serviceFactory.communicationService();
    }

    @Get("/structures/:structureId/communication/from/groups")
    @ApiDoc("Get groups that can communicate with me")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getGroupsCanCommunicateWithMe(final HttpServerRequest request) {
        String structureId = request.getParam(CAMEL_STRUCTURE_ID);
        if (structureId == null || structureId.isEmpty()) {
            badRequest(request);
            return;
        }

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> {
                if (!user.getStructures().contains(structureId)) {
                    String errorMessage = "Wrong structureId for user with id " + user.getUserId();
                    LogHelper.logError(this, "getGroupsCanCommunicateWithMe", errorMessage);
                    badRequest(request);
                    return Future.failedFuture("");
                }
                return communicationService.getGroupsCanCommunicateWithMe(user.getUserId(), structureId);
            })
            .onSuccess(groups -> renderJson(request, groups))
            .onFailure(err -> {
                if (!request.isEnded()) {
                    String errorMessage = "Failed to retrieve groups allow to communicate with connected user";
                    LogHelper.logError(this, "getGroupsCanCommunicateWithMe", errorMessage, err.getMessage());
                    renderError(request);
                }
            });
    }

    @Get("/communication/to/users")
    @ApiDoc("Get users I can communicate with")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getUsersICanCommunicateWith(final HttpServerRequest request) {
        String search = request.getParam(SEARCH);
        Long page = Optional.ofNullable(request.params().get(PAGE))
                .map(Long::parseLong)
                .orElse(null);
        Long limit = Optional.ofNullable(request.params().get(LIMIT))
                .map(Long::parseLong)
                .orElse(null);

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> communicationService.getUsersICanCommunicateWith(user.getUserId(), search, page, limit))
            .onSuccess(listUserAppointmentResponse -> {
                renderJson(request, IModelHelper.toJsonArray(listUserAppointmentResponse));
            })
            .onFailure(err -> {
                String errorMessage = "Failed to retrieve users I can communicate with";
                LogHelper.logError(this, "getUsersICanCommunicateWith", errorMessage, err.getMessage());
                renderError(request);
            });
    }
}
