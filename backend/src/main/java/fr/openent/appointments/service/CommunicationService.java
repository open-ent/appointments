package fr.openent.appointments.service;

import fr.openent.appointments.model.UserAppointment;
import fr.openent.appointments.model.database.NeoGroup;
import io.vertx.core.Future;
import org.entcore.common.user.UserInfos;

import java.util.List;
import java.util.Map;

public interface CommunicationService {
    
    /**
     * Retrieves all groups that the current user can communicate with.
     *
     * @param userId The ID of the user whose groups are to be retrieved.
     * @param structureId The ID of the structure the user selected.
     * @return A Future containing a JsonArray of groups.
     */
    Future<List<NeoGroup>> getGroupsICanCommunicateWith(String userId, String structureId);

    /**
     * Retrieves users that the current user can communicate with
     * or users that shared a grid with the current user.
     * Those users are filtered by the search value and by manage grid rights.
     *
     * @param userInfos The current user's information.
     * @param search The search value we want filter users with.
     * @param page The number of the page to retrieve.
     * @param limit The number of items per page.
     * @return A Future containing a JsonArray of groups.
     */
    Future<List<UserAppointment>> getUsers(UserInfos userInfos, String search, Long page, Long limit);

    /**
     * Retrieves all user names from their ids.
     *
     * @param usersIds The list of user IDs.
     * @return A Future containing a {@link Map}<{@link String}, {@link String}>.
     */
    Future<Map<String, String>> getUsernamesFromUserIds(List<String> userIds);
}
