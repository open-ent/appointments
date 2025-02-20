package fr.openent.appointments.controller;

import fr.openent.appointments.config.AppConfig;
import fr.openent.appointments.core.constants.WorkflowRight;
import fr.openent.appointments.security.ViewRight;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;

import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;

import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.http.filter.SuperAdminFilter;

import static fr.openent.appointments.core.constants.Constants.CAMEL_MIN_HOURS_BEFORE_CANCELLATION;
import static fr.openent.appointments.core.constants.Constants.CAMEL_THEME_PLATFORM;

public class MainController extends ControllerHelper {

    private final AppConfig appConfig;

    public MainController(ServiceFactory serviceFactory) {
        this.appConfig = serviceFactory.appConfig();
    }

    @Get("")
    @ApiDoc("Render home view")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void view(HttpServerRequest request) {
        JsonObject params = new JsonObject()
            .put(CAMEL_MIN_HOURS_BEFORE_CANCELLATION, appConfig.minHoursBeforeCancellation())
            .put(CAMEL_THEME_PLATFORM, appConfig.themePlatform());
        renderView(request, params, "index.html", null);
    }

    @Get("/config")
    @ApiDoc("Get configuration")
    @ResourceFilter(SuperAdminFilter.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getConfig(final HttpServerRequest request) {
        renderJson(request, config);
    }

    @SecuredAction(WorkflowRight.MANAGE)
    public void initManageRights(final HttpServerRequest request) {
    }

    @SecuredAction(WorkflowRight.VIEW)
    public void initViewRights(final HttpServerRequest request) {
    }
}
