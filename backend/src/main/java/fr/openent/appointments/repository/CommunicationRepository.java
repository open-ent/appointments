package fr.openent.appointments.repository;

import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;

public interface CommunicationRepository {
    /**
     * Retrieves all groups that can communicate with the current user.
     *
     * @param userId The ID of the user whose groups are to be retrieved.
     * @return A Future containing a JsonArray of groups.
     */
    Future<JsonArray> getGroupsCanCommunicateWithMe(String userId, String structureId);
}
