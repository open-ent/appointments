package fr.openent.appointments.controller;

import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.IModel;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.rs.Delete;
import fr.wseduc.webutils.request.RequestUtils;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;

import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;

import fr.openent.appointments.model.payload.GridPayload;
import fr.openent.appointments.service.GridService;
import fr.openent.appointments.service.ServiceFactory;
import fr.openent.appointments.security.ManageRight;
import fr.openent.appointments.security.ViewRight;
import org.entcore.common.user.UserUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static fr.openent.appointments.core.constants.Constants.*;

public class GridController extends ControllerHelper {
    private final GridService gridService;

    public GridController(ServiceFactory serviceFactory) {
        this.gridService = serviceFactory.gridService();
    }

    @Get("/grids")
    @ApiDoc("Get my grids")
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    @ResourceFilter(ManageRight.class)
    public void getMyGrids(final HttpServerRequest request) {
        Long page = Optional.ofNullable(request.params().get(PAGE))
                .map(Long::parseLong)
                .orElse(null);

        Long limit = Optional.ofNullable(request.params().get(LIMIT))
                .map(Long::parseLong)
                .orElse(null);

        List<GridState> states = new JsonArray(request.params().get(STATES)).stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .map(GridState::getGridState)
                .collect(Collectors.toList());

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> gridService.getMyMinimalGrids(user.getUserId(), states, page, limit))
            .onSuccess(listGridsResponse -> renderJson(request, listGridsResponse.toJson()))
            .onFailure(error -> {
                String errorMessage = "Failed to get my grids";
                LogHelper.logError(this, "getMyGrids", errorMessage, error.getMessage());
                renderError(request);
            });
    }

    @Get("/grids/names")
    @ApiDoc("Get my grids name")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getMyGridsName(final HttpServerRequest request) {
        UserUtils.getAuthenticatedUserInfos(eb, request)
                .compose(user -> gridService.getGridsName(user.getUserId()))
                .onSuccess(response -> renderJson(request, response))
                .onFailure(error -> {
                    String errorMessage = String.format("[Appointments@%s::getMyGridsName] Failed to get my grids name : %s", this.getClass().getSimpleName(), error.getMessage());
                    log.error(errorMessage);
                    badRequest(request);
                });
    }

    @Get("/grids/:id")
    @ApiDoc("Get grid by id")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getGridById(final HttpServerRequest request) {
        
        renderJson(request, new JsonObject());
    }

    @Get("/users/:id/grids")
    @ApiDoc("Get user grids")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getUserGrids(final HttpServerRequest request) {
        
        renderJson(request, new JsonObject());
    }

    @Post("/grids")
    @ApiDoc("Create grid")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void createGrid(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, body -> {
            GridPayload gridPayload = new GridPayload(body);
            if (!gridPayload.isValid()) {
                String errorMessage = "Invalid grid payload";
                LogHelper.logError(this, "createGrid", errorMessage, gridPayload.toString());
                badRequest(request);
                return;
            }

            gridPayload.buildTimeSlots();
            gridService.createGrid(request, gridPayload)
                .onSuccess(grid -> renderJson(request, grid.toJson()))
                .onFailure(err -> {
                    String errorMessage = "Failed to create grid";
                    LogHelper.logError(this, "createGrid", errorMessage, err.getMessage());
                    badRequest(request);
                });
        });
    }

    @Put("/grids/:id")
    @ApiDoc("Update grid")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void updateGrid(final HttpServerRequest request) {
        
        renderJson(request, new JsonObject());
    }

    @Delete("/grids/:id")
    @ApiDoc("Delete grid")
    @ResourceFilter(ManageRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void deleteGrid(final HttpServerRequest request) {
        
        renderJson(request, new JsonObject());
    }
}
