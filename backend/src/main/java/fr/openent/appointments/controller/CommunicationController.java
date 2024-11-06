package fr.openent.appointments.controller;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.service.CommunicationService;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.security.ActionType;
import fr.wseduc.webutils.http.BaseController;
import org.entcore.common.http.filter.ResourceFilter;
import io.vertx.core.http.HttpServerRequest;
import fr.openent.appointments.security.ManageRight;
import org.entcore.common.user.UserUtils;


public class CommunicationController extends BaseController {
    private final CommunicationService communicationService;

    public CommunicationController(ServiceFactory serviceFactory) {
        this.communicationService = serviceFactory.communicationService();
    }

    @Get("/structures/:structureId/communication/groups")
    @ApiDoc("Get groups that can communicate with me")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getGroupsCanCommunicateWithMe(final HttpServerRequest request) {
        String structureId = request.getParam(Fields.CAMEL_STRUCTURE_ID);
        if (structureId == null || structureId.isEmpty()) {
            badRequest(request);
            return;
        }
        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> communicationService.getGroupsCanCommunicateWithMe(user.getUserId(), structureId))
            .onSuccess(groups -> renderJson(request, groups))
            .onFailure(error -> {
                String errorMessage = String.format("[Appointments@CommunicationController::getGroupsCanCommunicateWithMe] %s", error.getMessage());
                log.error(errorMessage);
                renderError(request);
            });
    }
}
