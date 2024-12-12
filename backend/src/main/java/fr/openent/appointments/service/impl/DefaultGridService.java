package fr.openent.appointments.service.impl;

import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.response.MinimalGrid;
import fr.openent.appointments.model.response.ListGridsResponse;
import fr.openent.appointments.model.database.Grid;
import fr.openent.appointments.model.response.MinimalGridInfos;
import fr.openent.appointments.repository.TimeSlotRepository;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import fr.openent.appointments.model.payload.GridPayload;
import fr.openent.appointments.repository.GridRepository;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.service.GridService;
import fr.openent.appointments.service.ServiceFactory;
import fr.openent.appointments.enums.GridState;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;

/**
 * Default implementation of the GridService interface.
 */
public class DefaultGridService implements GridService {
    private static final Logger log = LoggerFactory.getLogger(DefaultGridService.class);

    private final EventBus eb;
    private final GridRepository gridRepository;
    private final TimeSlotRepository timeSlotRepository;

    public DefaultGridService(ServiceFactory serviceFactory, RepositoryFactory repositoryFactory) {
        this.eb = serviceFactory.eventBus();
        this.gridRepository = repositoryFactory.gridRepository();
        this.timeSlotRepository = repositoryFactory.timeSlotRepository();
    }

    @Override
    public Future<ListGridsResponse> getMyMinimalGrids(String userId, List<GridState> states, Long page, Long limit) {
        Promise<ListGridsResponse> promise = Promise.promise();

        gridRepository.getMyGrids(userId, states)
            .onSuccess(grids -> promise.complete(this.buildListGridsResponse(grids, page, limit)))
            .onFailure(error -> {
                String errorMessage = "Failed to get my grids";
                LogHelper.logError(this, "getMyMinimalGrids", errorMessage, error.getMessage());
                promise.fail(error.getMessage());
            });

        return promise.future();
    }

    @Override
    public Future<List<Grid>> getMyGrids(String userId, List<GridState> states) {
        return gridRepository.getMyGrids(userId, states);
    }

    @Override
    public Future<JsonArray> getGridsName(String userId) {
        return gridRepository.getGridsName(userId);
    }


    @Override
    public Future<JsonArray> getGridById(Integer gridId) {
        // TODO: Implement the logic to retrieve a specific grid by its ID.
        return Future.succeededFuture(new JsonArray());
    }

    @Override
    public Future<Grid> getGridByTimeSlotId(Long timeSlotId) {
        Promise<Grid> promise = Promise.promise();

        timeSlotRepository.get(timeSlotId)
            .compose(timeSlot -> {
                if (!timeSlot.isPresent()) return Future.failedFuture("Time slot not found");
                return gridRepository.get(timeSlot.get().getGridId());
            })
            .onSuccess(grid -> {
                if (grid.isPresent()) promise.complete(grid.get());
                else promise.fail("Grid not found");
            }
            ).onFailure(err -> {
                String errorMessage = "Failed to get grid by time slot id";
                LogHelper.logError(this, "getGridByTimeSlotId", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    @Override
    public Future<List<MinimalGrid>> getAvailableUserMinimalGrids(UserInfos user) {
        Promise<List<MinimalGrid>> promise = Promise.promise();

        gridRepository.getGridsGroupsCanAccess(user.getGroupsIds())
            .compose(userGrids -> gridRepository.getGridsWithAvailableTimeSlots(userGrids.stream().map(Grid::getId).collect(Collectors.toList())))
            .onSuccess(grids -> promise.complete(grids.stream().map(MinimalGrid::new).collect(Collectors.toList())))
            .onFailure(err -> {
                String errorMessage = "Failed to get available grids for user with id " + user.getUserId();
                LogHelper.logError(this, "getAvailableUserMinimalGrids", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    @Override
    public Future<MinimalGridInfos> getMinimalGridInfosById(UserInfos user, Long gridId) {
        Promise<MinimalGridInfos> promise = Promise.promise();

        gridRepository.getGridsGroupsCanAccess(user.getGroupsIds())
            .compose(userGrids -> {
                if (!userGrids.stream().map(Grid::getId).collect(Collectors.toList()).contains(gridId)) {
                    String errorMessage = String.format("The grid with id %s is not shared to the connected user", gridId);
                    return Future.failedFuture(errorMessage);
                }

                return gridRepository.get(gridId);
            })
            .onSuccess(optionalGrid -> {
                if (!optionalGrid.isPresent()) {
                    String errorMessage = "No grid found for id " + gridId;
                    promise.fail(errorMessage);
                }
                else {
                    promise.complete(new MinimalGridInfos(optionalGrid.get()));
                }
            })
            .onFailure(err -> {
                String errorMessage = "Failed to get grid with id " + gridId;
                LogHelper.logError(this, "getMinimalGridInfosById", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    @Override
    public Future<List<Long>> getGridsIdsWithAvailableTimeSlots(List<Long> gridsIds) {
        Promise<List<Long>> promise = Promise.promise();

        gridRepository.getGridsWithAvailableTimeSlots(gridsIds)
            .onSuccess(grids -> promise.complete(grids.stream().map(Grid::getId).distinct().collect(Collectors.toList())))
            .onFailure(err -> {
                String errorMessage = "Failed to get grids with available timeslots from grid ids " + gridsIds;
                LogHelper.logError(this, "getGridsIdsWithAvailableTimeSlots", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    private Future<Boolean> isGridAlreadyExists(String gridName, String userId) {
        Promise<Boolean> promise = Promise.promise();

        List<GridState> gridStates = new ArrayList<>();
        gridStates.add(GridState.OPEN);
        gridStates.add(GridState.SUSPENDED);

        gridRepository.getMyGridsByName(userId, gridName, gridStates)
            .onSuccess(grids -> promise.complete(!grids.isEmpty()))
            .onFailure(err -> {
                String errorMessage = String.format("[Appointments@DefaultGridService::isGridAlreadyExists] %s", err.getMessage());
                log.error(errorMessage);
                promise.fail(err);
            });

        return promise.future();
    }

    @Override
    public Future<Grid> createGrid(HttpServerRequest request, GridPayload gridPayload) {
        Promise<Grid> promise = Promise.promise();

        UserUtils.getAuthenticatedUserInfos(eb, request)
            .compose(user -> isGridAlreadyExists(gridPayload.getGridName(), user.getUserId())
            .compose(isExists -> {
                if (isExists) return Future.failedFuture("Grid already exists");
                return gridRepository.create(gridPayload, user.getUserId());
            }))
            .onSuccess(promise::complete)
            .onFailure(err -> {
                String errorMessage = "Failed to create grid";
                LogHelper.logError(this, "createGrid", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }


    @Override
    public Future<Void> updateGrid(Integer gridId, JsonArray grid) {
        // TODO: Implement the logic to update an existing grid.
        return Future.succeededFuture();
    }

    @Override
    public Future<Void> suspendGrid(Integer gridId) {
        // TODO: Implement the logic to suspend a specific grid.
        return Future.succeededFuture();
    }

    @Override
    public Future<Void> restoreGrid(Integer gridId) {
        // TODO: Implement the logic to restore a suspended grid.
        return Future.succeededFuture();
    }

    @Override
    public Future<Void> deleteGrid(Integer gridId) {
        // TODO: Implement the logic to delete a specific grid.
        return Future.succeededFuture();
    }

    @Override
    public Future<JsonObject> closeAllPassedGrids() {
        return gridRepository.closeAllPassedGrids();
    }

    // Private functions

    private ListGridsResponse buildListGridsResponse(List<Grid> grids, Long page, Long limit) {
        List<Grid> paginatedGrids = grids;

        if (page != null && page >= 1 && limit != null && limit >= 1) {
            paginatedGrids = grids.stream()
                .skip((page - 1) * limit)
                .limit(limit)
                .collect(Collectors.toList());
        }

        return new ListGridsResponse((long) grids.size(), paginatedGrids);
    }
}
