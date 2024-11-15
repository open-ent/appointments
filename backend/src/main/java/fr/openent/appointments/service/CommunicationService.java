package fr.openent.appointments.service;

import fr.openent.appointments.model.UserAppointment;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;

import java.util.List;

public interface CommunicationService {
    
    /**
     * Retrieves all groups that can communicate with the current user.
     *
     * @param userId The ID of the user whose groups are to be retrieved.
     * @param structureId The ID of the structure the user selected.
     * @return A Future containing a JsonArray of groups.
     */
    Future<JsonArray> getGroupsCanCommunicateWithMe(String userId, String structureId);

    /**
     * Retrieves all people that the current user can communicate with.
     *
     * @param userId The ID of the current user.
     * @param search The search value we want filter users with.
     * @param page The number of the page to retrieve.
     * @param limit The number of items per page.
     * @return A Future containing a JsonArray of groups.
     */
    Future<List<UserAppointment>> getUsersICanCommunicateWith(String userId, String search, Long page, Long limit);
}
