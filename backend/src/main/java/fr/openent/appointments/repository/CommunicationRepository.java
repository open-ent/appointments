package fr.openent.appointments.repository;

import fr.openent.appointments.model.database.NeoGroup;
import fr.openent.appointments.model.database.NeoStructure;
import fr.openent.appointments.model.database.NeoUser;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;

import java.util.List;
import java.util.Optional;

public interface CommunicationRepository {
    /**
     * Retrieves all groups the current user can communicate with.
     *
     * @param userId The ID of the user whose groups are to be retrieved.
     * @param structureId The ID of the structure the user selected.
     * @return A Future containing a JsonArray of groups.
     */
    Future<List<NeoGroup>> getGroupsICanCommunicateWith(String userId, String structureId);

    /**
     * Retrieves all groups the current user can communicate with good rights.
     *
     * @param userId The ID of the user whose groups are to be retrieved.
     * @return A Future containing a {@link List} of {@link NeoGroup}.
     */
    Future<List<NeoGroup>> getGroupsICanCommunicateWithGoodRights(String userId);

    /**
     * Retrieves all users matching the given groups IDs.
     *
     * @param groupsIds The list of group IDs to filter users.
     * @return A Future containing a {@link List} of {@link NeoUser}.
     */
    Future<List<NeoUser>> getUsersFromGroupsIds(List<String> groupsIds);

    /**
     * Retrieves all users matching the given groups or users IDs.
     *
     * @param usersIds The list of user IDs to filter users.
     * @param structuresIds The list of structure external IDs to filter users.
     * @return A Future containing a {@link List} of {@link NeoUser}.
     */
    public Future<List<NeoUser>> getUsersFromUsersIds(List<String> usersIds, List<String> structuresIds);

    /**
     * Retrieves NeoUser from its ID.
     *
     * @param userId The ID of the user we want to retrieve.
     * @param structuresIds The {@link List} of ID of structure externalID the user belongs to.
     * @return A Future containing a {@link NeoUser}.
     */
    Future<Optional<NeoUser>> getUserFromId(String userId, List<String> structuresIds);

    /**
     * Retrieves Structure from its ID.
     *
     * @param structureId The ID of the structure we want to retrieve.
     * @return A Future containing a {@link NeoStructure}.
     */
    Future<Optional<NeoStructure>> getStructure(String structureId);

    /**
     * Retrieves Groups from a list of groupId
     *
     * @param groupIds The list of groupIds we want to retrieve.
     * @return A Future containing a {@link List} of {@link NeoGroup}.
     */
    Future<List<NeoGroup>> getGroups(List<String> groupIds);
}
