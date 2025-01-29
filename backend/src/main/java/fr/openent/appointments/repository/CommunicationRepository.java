package fr.openent.appointments.repository;

import fr.openent.appointments.model.database.NeoGroup;
import fr.openent.appointments.model.database.NeoUser;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;

import java.util.List;
import java.util.Optional;

public interface CommunicationRepository {
    /**
     * Retrieves all groups that can communicate with the current user.
     *
     * @param userId The ID of the user whose groups are to be retrieved.
     * @param structureId The ID of the structure the user selected.
     * @return A Future containing a JsonArray of groups.
     */
    Future<List<NeoGroup>> getGroupsCanCommunicateWithMe(String userId, String structureId);

    /**
     * Retrieves all groups the current user can communicate with.
     *
     * @param userId The ID of the user whose groups are to be retrieved.
     * @return A Future containing a {@link List} of {@link NeoGroup}.
     */
    Future<List<NeoGroup>> getGroupsICanCommunicateWith(String userId);

    /**
     * Retrieves all groups the current user can communicate with.
     *
     * @param groupsIds The IDs of the groups we want the users infos from.
     * @param structureExternalIds The {@link List} of ID of structure externalID the user belongs to.
     * @return A Future containing a {@link List} of {@link NeoUser}.
     */
    Future<List<NeoUser>> getUsersFromGroupsIds(List<String> groupsIds, List<String> structureExternalIds);

    /**
     * Retrieves NeoUser from its ID.
     *
     * @param userId The ID of the user we want to retrieve.
     * @param structuresIds The {@link List} of ID of structure externalID the user belongs to.
     * @return A Future containing a {@link NeoUser}.
     */
    Future<Optional<NeoUser>> getUserFromId(String userId, List<String> structuresIds);
}
