package fr.openent.appointments.controller;

import fr.openent.appointments.core.constants.WorkflowRight;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.http.Renders;

import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;

import org.entcore.common.controller.ControllerHelper;

public class AppointmentsController extends ControllerHelper {

    public AppointmentsController() {
        super();
    }

    @Get("")
    @ApiDoc("Render home view")
    @SecuredAction(WorkflowRight.VIEW)
    public void view(HttpServerRequest request) {
        renderView(request, new JsonObject(), "index.html", null);
    }
}
