package fr.openent.appointments.service.impl;

import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.UserAppointment;
import fr.openent.appointments.model.database.NeoGroup;
import fr.openent.appointments.model.database.NeoUser;
import fr.openent.appointments.service.CommunicationService;
import fr.openent.appointments.repository.CommunicationRepository;
import fr.openent.appointments.service.ServiceFactory;
import fr.openent.appointments.repository.RepositoryFactory;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static fr.openent.appointments.core.constants.Constants.STRUCTURES;

public class DefaultCommunicationService implements CommunicationService {
    private final CommunicationRepository communicationRepository;

    public DefaultCommunicationService(RepositoryFactory repositoryFactory) {
        this.communicationRepository = repositoryFactory.communicationRepository();
    }


    @Override
    public Future<JsonArray> getGroupsCanCommunicateWithMe(String userId, String structureId){
        Promise<JsonArray> promise = Promise.promise();

        communicationRepository.getGroupsCanCommunicateWithMe(userId, structureId)
            .onSuccess(promise::complete)
            .onFailure(err -> {
                String errorMessage = "Failed to retrieve groups allow to communicate with me";
                LogHelper.logError(this, "getGroupsCanCommunicateWithMe", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    @Override
    public Future<List<UserAppointment>> getUsersICanCommunicateWith(String userId, String search, Long page, Long limit) {
        Promise<List<UserAppointment>> promise = Promise.promise();


        communicationRepository.getGroupsICanCommunicateWith(userId)
            .compose(groups -> {
                List<String> groupsIds = groups.stream()
                        .map(NeoGroup::getId)
                        .collect(Collectors.toList());
                return this.getUsersFromGroupsIds(userId, groupsIds);
            })
            .onSuccess(users -> {
                List<NeoUser> filteredUsers = filterNeoUsersBySearchAndPagination(users, search, page, limit);
                promise.complete(buildListUserAppointementResponse(filteredUsers));
            })
            .onFailure(err -> {
                String errorMessage = "Failed to retrieve users I can communicate with";
                LogHelper.logError(this, "getUsersICanCommunicateWith", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    // Private functions

    private Future<List<NeoUser>> getUsersFromGroupsIds(String userId, List<String> groupsIds) {
        Promise<List<NeoUser>> promise = Promise.promise();

        communicationRepository.getUserStructuresExternalIds(userId)
            .compose(structures -> {
                List<String> structuresIds = structures
                        .getJsonObject(0)
                        .getJsonArray(STRUCTURES)
                        .stream()
                        .filter(String.class::isInstance)
                        .map(String.class::cast)
                        .collect(Collectors.toList());
                return communicationRepository.getUsersFromGroupsIds(groupsIds, structuresIds);
            })
            .onSuccess(promise::complete)
            .onFailure(err -> {
                String errorMessage = "Failed to retrieve users from groupsIds and current user id ";
                LogHelper.logError(this, "getUsersFromGroupsIds", errorMessage, err.getMessage());
                promise.fail(err);
            });

        return promise.future();
    }

    private List<NeoUser> filterNeoUsersBySearchAndPagination(List<NeoUser> users, String search, Long page, Long limit) {
        List<NeoUser> filteredUsers = users;

        if (search != null && !search.isEmpty()) {
            filteredUsers = filteredUsers.stream()
                .filter(user -> user.getDisplayName().toLowerCase().contains(search.toLowerCase()) ||
                                user.getFunctions().stream().anyMatch(fn -> fn.toLowerCase().contains(search.toLowerCase())))
                .collect(Collectors.toList());
        }

        if (page != null && page >= 1 && limit != null && limit >= 1) {
            filteredUsers = filteredUsers.stream()
                .skip((page - 1) * limit)
                .limit(limit)
                .collect(Collectors.toList());
        }

        return filteredUsers;
    }

    private List<UserAppointment> buildListUserAppointementResponse(List<NeoUser> users) {
        return users.stream()
            .map(UserAppointment::new)
            .collect(Collectors.toList());
    }
}
