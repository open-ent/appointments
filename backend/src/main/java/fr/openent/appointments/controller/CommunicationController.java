package fr.openent.appointments.controller;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.database.NeoGroup;
import fr.openent.appointments.helper.ParamHelper;
import fr.openent.appointments.security.ViewRight;
import fr.openent.appointments.service.CommunicationService;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.security.ActionType;
import fr.wseduc.webutils.I18n;
import fr.wseduc.webutils.http.BaseController;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import org.entcore.common.http.filter.ResourceFilter;
import io.vertx.core.http.HttpServerRequest;
import fr.openent.appointments.security.ManageRight;
import org.entcore.common.user.UserUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;

import static fr.openent.appointments.core.constants.Constants.*;


public class CommunicationController extends BaseController {
    private final CommunicationService communicationService;

    public CommunicationController(ServiceFactory serviceFactory) {
        this.communicationService = serviceFactory.communicationService();
    }

    private List<NeoGroup> formatGroupList(final HttpServerRequest request, List<NeoGroup> groups) {
        String language = I18n.acceptLanguage(request);

        groups.forEach(group -> {
            String formattedName = UserUtils.groupDisplayName(group.getName(), null, language);
            group.setName(formattedName);
        });

        return groups;
    }


    @Get("/structures/:structureId/communication/from/groups")
    @ApiDoc("Get groups that can communicate with me")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getGroupsCanCommunicateWithMe(final HttpServerRequest request) {
        String structureId = ParamHelper.getParam(CAMEL_STRUCTURE_ID, request, String.class, true, "getGroupsCanCommunicateWithMe");
        if (request.response().ended()) return;

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
            .onSuccess(groups -> renderJson(request, new JsonArray(formatGroupList(request, groups))))
            .onFailure(err -> {
                if (!request.response().ended()) {
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
        Map<String, Class<?>> requestParams = new HashMap<>();
        requestParams.put(SEARCH, String.class);
        requestParams.put(PAGE, Long.class);
        requestParams.put(LIMIT, Long.class);

        Map<String, Object> paramValues = ParamHelper.getParams(requestParams, request, new String[0], "getUsersICanCommunicateWith");
        if (request.response().ended()) return;

        String search = (String) paramValues.get(SEARCH);
        Long page = (Long) paramValues.get(PAGE);
        Long limit = (Long) paramValues.get(LIMIT);

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> communicationService.getUsersICanCommunicateWith(user, search, page, limit))
            .onSuccess(listUserAppointmentResponse -> renderJson(request, IModelHelper.toJsonArray(listUserAppointmentResponse)))
            .onFailure(err -> {
                String errorMessage = "Failed to retrieve users I can communicate with";
                LogHelper.logError(this, "getUsersICanCommunicateWith", errorMessage, err.getMessage());
                renderError(request);
            });
    }
}
