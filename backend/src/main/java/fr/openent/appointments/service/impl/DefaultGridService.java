package fr.openent.appointments.service.impl;

import fr.openent.appointments.helper.EventBusHelper;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.database.*;
import fr.openent.appointments.model.response.*;
import fr.openent.appointments.model.workspace.CompleteDocument;
import fr.openent.appointments.repository.*;
import fr.openent.appointments.service.EventBusService;
import io.vertx.core.eventbus.DeliveryOptions;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import fr.openent.appointments.model.payload.GridPayload;
import fr.openent.appointments.service.GridService;
import fr.openent.appointments.service.ServiceFactory;
import fr.openent.appointments.enums.GridState;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.EbFields.*;
import static fr.openent.appointments.helper.JsonHelper.jsonArrayToList;

/**
 * Default implementation of the GridService interface.
 */
public class DefaultGridService implements GridService {
    private static final Logger log = LoggerFactory.getLogger(DefaultGridService.class);

    private final EventBus eb;
    private final EventBusService eventBusService;
    private final GridRepository gridRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final DailySlotRepository dailySlotRepository;
    private final CommunicationRepository communicationRepository;

    public DefaultGridService(ServiceFactory serviceFactory, RepositoryFactory repositoryFactory) {
        this.eb = serviceFactory.eventBus();
        this.eventBusService = serviceFactory.eventBusService();
        this.gridRepository = repositoryFactory.gridRepository();
        this.timeSlotRepository = repositoryFactory.timeSlotRepository();
        this.dailySlotRepository = repositoryFactory.dailySlotRepository();
        this.communicationRepository = repositoryFactory.communicationRepository();
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
    public Future<Grid> getGridById(Long gridId) {
        Promise<Grid> promise = Promise.promise();

        gridRepository.get(gridId)
                .onSuccess(grid -> {
                    if (grid.isPresent()) promise.complete(grid.get());
                    else promise.fail("Grid not found");
                })
                .onFailure(err -> {
                    String errorMessage = "Failed to get grid by id";
                    LogHelper.logError(this, "getGridById", errorMessage, err.getMessage());
                    promise.fail(err);
                });

        return promise.future();
    }

    @Override
    public Future<GridWithDailySlots> getGridWithDailySlots(Long gridId, String userId) {
        Promise<GridWithDailySlots> promise = Promise.promise();
        
        JsonObject composeInfos = new JsonObject();

        gridRepository.get(gridId)
            .compose(grid -> {
                if (!grid.isPresent()) return Future.failedFuture("Grid not found");
                Grid gridFetched = grid.get();
                composeInfos.put(GRID, gridFetched);
                return communicationRepository.getGroups(gridFetched.getTargetPublicListId());
            })
            .compose(groups -> {
                composeInfos.put(GROUPS, groups);
                Grid grid = (Grid) composeInfos.getValue(GRID);
                return communicationRepository.getStructure(grid.getStructureId());
            })
            .compose(neoStructure -> {
                if(!neoStructure.isPresent()) return Future.failedFuture("Structure not found");
                composeInfos.put(STRUCTURE, neoStructure.get());
                return dailySlotRepository.getByGridId(gridId);
            })
            .compose(dailySlots -> {
                composeInfos.put(CAMEL_DAILY_SLOTS, dailySlots);
                Grid grid = (Grid) composeInfos.getValue(GRID);
                return eventBusService.getDocumentResponseFromGrid(grid.getOwnerId(), grid.getDocumentsIds());
            })
            .onSuccess(documents -> {
                Grid grid = (Grid) composeInfos.getValue(GRID);
                NeoStructure structure = (NeoStructure) composeInfos.getValue(STRUCTURE);
                List<NeoGroup> groups = composeInfos.getJsonArray(GROUPS).stream()
                        .map(group -> (NeoGroup) group)
                        .collect(Collectors.toList());
                List<DailySlot> dailySlots = composeInfos.getJsonArray(CAMEL_DAILY_SLOTS).stream()
                        .map(dailySlot -> (DailySlot) dailySlot)
                        .collect(Collectors.toList());
                promise.complete(new GridWithDailySlots(grid, structure, groups, dailySlots, documents));
            })
            .onFailure(err -> {
                String errorMessage = "Failed to get grid by id";
                LogHelper.logError(this, "getGridWithDailySlots", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
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
    public Future<List<MinimalGrid>> getAvailableUserMinimalGrids(UserInfos user, String userId) {
        Promise<List<MinimalGrid>> promise = Promise.promise();

        gridRepository.getGridsGroupsCanAccess(user.getGroupsIds())
            .compose(userGrids -> {
                userGrids = userGrids.stream().filter(grid -> grid.getOwnerId().equals(userId)).collect(Collectors.toList());
                return gridRepository.getGridsWithAvailableTimeSlots(userGrids.stream().map(Grid::getId).collect(Collectors.toList()));
            })
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

        JsonObject composeInfos = new JsonObject();

        gridRepository.getGridsGroupsCanAccess(user.getGroupsIds())
            .compose(userGrids -> {
                if (!userGrids.stream().map(Grid::getId).collect(Collectors.toList()).contains(gridId)) {
                    String errorMessage = String.format("The grid with id %s is not shared to the connected user", gridId);
                    return Future.failedFuture(errorMessage);
                }
                return gridRepository.get(gridId);
            })
            .compose(optionalGrid -> {
                if (!optionalGrid.isPresent()) {
                    String errorMessage = "No grid found for id " + gridId;
                    return Future.failedFuture(errorMessage);
                }
                return Future.succeededFuture(optionalGrid.get());
            })
            .compose(grid -> {
                composeInfos.put(GRID, grid);
                return eventBusService.getDocumentResponseFromGrid(grid.getOwnerId(), grid.getDocumentsIds());
            })
            .onSuccess(documents -> {
                Grid grid = (Grid) composeInfos.getValue(GRID);
                promise.complete(new MinimalGridInfos(grid, documents));
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
    public Future<Grid> updateGrid(Long gridId, GridPayload grid) {
        Promise<Grid> promise = Promise.promise();

        Future<Void> updateTimeSlotsFuture;

        if (grid.getTimeSlots() != null && !grid.getTimeSlots().isEmpty()) {
            // On supprime tous les anciens TimeSlots, puis on recrée les DailySlots, puis les TimeSlots
            updateTimeSlotsFuture = timeSlotRepository.markAllGridTimeSlotsToDeleted(gridId)
                    .compose(v -> dailySlotRepository.removeByGridId(gridId))
                    .compose(v -> dailySlotRepository.create(gridId, grid.getDailySlots()))
                    .compose(createdDailySlots -> timeSlotRepository.create(gridId, grid.getTimeSlots()))
                    .mapEmpty(); // mapEmpty pour retourner Future<Void>
        } else {
            // Pas de TimeSlots à mettre à jour, on continue directement
            updateTimeSlotsFuture = Future.succeededFuture();
        }

        updateTimeSlotsFuture
            .compose(v -> gridRepository.updateFields(gridId, grid))
            .onSuccess(updatedGrid -> {
                if (updatedGrid.isPresent()) promise.complete(updatedGrid.get());
                else{
                    String errorMessage = "Failed to update grid";
                    LogHelper.logError(this, "updateGrid", errorMessage, "Grid not found");
                    promise.fail(errorMessage);
                }
            })
            .onFailure(err -> {
                String errorMessage = "Failed to update grid";
                LogHelper.logError(this, "updateGrid", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    @Override
    public Future<List<Appointment>> suspendGrid(Long gridId, boolean deleteAppointments) {
        return gridRepository.updateState(gridId, GridState.SUSPENDED, deleteAppointments);
    }

    @Override
    public Future<List<Appointment>> restoreGrid(Long gridId) {
        return gridRepository.updateState(gridId, GridState.OPEN, false);
    }

    @Override
    public Future<List<Appointment>> deleteGrid(Long gridId, boolean deleteAppointments) {
        return gridRepository.updateState(gridId, GridState.DELETED, deleteAppointments);
    }

    @Override
    public Future<JsonObject> closeAllPassedGrids() {
        return gridRepository.closeAllPassedGrids();
    }

    @Override
    public Future<List<String>> getUserIdsWhoSharedAGridWithMe(UserInfos user){
        Promise<List<String>> promise = Promise.promise();

        List<GridState> gridStates = new ArrayList<>();
        gridStates.add(GridState.OPEN);
        gridStates.add(GridState.SUSPENDED);

        gridRepository.getAllGridsByState(gridStates)
            .onSuccess(grids -> {
                List<String> ownersIds = grids.stream()
                        .filter(grid -> grid.getTargetPublicListId()
                                .stream()
                                .anyMatch(user.getGroupsIds()::contains))
                        .map(Grid::getOwnerId)
                        .distinct()
                        .collect(Collectors.toList());
                promise.complete(ownersIds);
            })
            .onFailure(err -> {
                String errorMessage = "Failed to get user ids who shared a grid with me";
                LogHelper.logError(this, "getUserIdsWhoSharedAGridWithMe", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
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
