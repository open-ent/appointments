package fr.openent.appointments.repository.impl;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.database.NeoGroup;
import fr.openent.appointments.model.database.NeoStructure;
import fr.openent.appointments.model.database.NeoUser;
import fr.openent.appointments.repository.CommunicationRepository;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.helper.FutureHelper;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.neo4j.Neo4jResult;

import java.util.List;
import java.util.Optional;

import static fr.openent.appointments.core.constants.Constants.*;

/**
 * Default implementation of the CommunicationRepository interface.
 */
public class DefaultCommunicationRepository implements CommunicationRepository {

    private final Neo4j neo4j;

    public DefaultCommunicationRepository(RepositoryFactory repositoryFactory) {
        this.neo4j = repositoryFactory.neo4j();
    }

    public Future<List<NeoGroup>> getGroupsICanCommunicateWith(String userId, String structureId) {
        Promise<List<NeoGroup>> promise = Promise.promise();

        String query = getCommunicationQuery();
        JsonObject params = new JsonObject()
                .put(CAMEL_USER_ID, userId)
                .put(CAMEL_STRUCTURE_ID, structureId);

        String errorMessage = "[Appointments@DefaultCommunicationRepository::getGroupsICanCommunicateWith] Fail to retrieve visible groups : ";
        neo4j.execute(query, params, Neo4jResult.validResultHandler(IModelHelper.resultToIModel(promise, NeoGroup.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<NeoGroup>> getGroupsICanCommunicateWithGoodRights(String userId) {
        Promise<List<NeoGroup>> promise = Promise.promise();

        String query = getQueryGroupsICanCommunicateWithFilterByRight();
        JsonObject params = new JsonObject()
                .put(CAMEL_USER_ID, userId)
                .put(CAMEL_RIGHT, "fr.openent.appointments.controller.MainController|initManageRights");


        String errorMessage = "[Appointments@DefaultCommunicationRepository::getGroupsICanCommunicateWithGoodRights] Fail to retrieve visible groups : ";
        neo4j.execute(query, params, Neo4jResult.validResultHandler(IModelHelper.resultToIModel(promise, NeoGroup.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<NeoUser>> getUsersFromGroupsIds(List<String> groupsIds) {
        Promise<List<NeoUser>> promise = Promise.promise();

        String query =
            "UNWIND {groupsIds} AS groupId " +
            "MATCH (g:Group {id: groupId})<-[:IN]-(u:User) " +
            "RETURN DISTINCT u.id AS id ";

        JsonObject params = new JsonObject().put(CAMEL_GROUPS_IDS, new JsonArray(groupsIds));

        String errorMessage = String.format("[Appointments@DefaultCommunicationRepository::getUsersIdsFromGroupsIds] Fail to retrieve users ids from groups ids %s : ", groupsIds);

        neo4j.execute(query, params, Neo4jResult.validResultHandler(IModelHelper.resultToIModel(promise, NeoUser.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<NeoUser>> getUsersFromUsersIds(List<String> usersIds, List<String> structuresIds) {
        Promise<List<NeoUser>> promise = Promise.promise();

        String query =
            "UNWIND {usersIds} AS userId " +
            "MATCH (u:User {id: userId}) " +

            "WITH DISTINCT u " +

            // UserBook (optionnel)
            "OPTIONAL MATCH (u)-[:USERBOOK]->(ub:UserBook) " +
            "WITH u, ub " +

            // Structures -> récupération des externalIds
            "MATCH (s:Structure) " +
                "WHERE s.id IN {structuresIds} " +
                "WITH collect(s.externalId) AS structuresExternalIds, u, ub " +

            // Retour des données
            "RETURN " +
                "u.id AS id, " +
                "u.displayName AS displayName, " +
                "[func IN u.functions WHERE split(func, \"$\")[0] IN structuresExternalIds] AS functions, " +
                "ub.picture AS picture, " +
                "u.profiles AS profiles;";

        JsonObject params = new JsonObject()
                .put(CAMEL_STRUCTURES_IDS, structuresIds)
                .put(CAMEL_USERS_IDS, usersIds);

        String errorMessage = String.format("[Appointments@DefaultCommunicationRepository::getUsersFromUsersIdsWithGoodRight] Fail to retrieve users from usersIds %s : ", usersIds);
        neo4j.execute(query, params, Neo4jResult.validResultHandler(IModelHelper.resultToIModel(promise, NeoUser.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<Optional<NeoUser>> getUserFromId(String userId, List<String> structuresIds) {
        Promise<Optional<NeoUser>> promise = Promise.promise();

        String query =
                "MATCH (s:Structure) " +
                "WHERE s.id IN {structuresIds} " +
                "WITH collect(s.externalId) AS structuresExternalIds " +

                "MATCH (u:User {id: {userId}}) " +
                "OPTIONAL MATCH (u)-[:USERBOOK]->(ub:UserBook) " +
                "WITH u, ub, [func IN u.functions WHERE split(func, \"$\")[0] IN structuresExternalIds] AS filteredFunctions " +
                "RETURN u.id AS id, u.displayName AS displayName, filteredFunctions AS functions, ub.picture AS picture, u.profiles as profiles;";
        JsonObject params = new JsonObject().put(CAMEL_USER_ID, userId).put(CAMEL_STRUCTURES_IDS, structuresIds);

        String errorMessage = String.format("[Appointments@DefaultCommunicationRepository::getUserFromId] Fail to retrieve user with id %s : ", userId);
        neo4j.execute(query, params, Neo4jResult.validUniqueResultHandler(IModelHelper.uniqueResultToIModel(promise, NeoUser.class, errorMessage)));

        return promise.future();
    }

    private String getCommunicationQuery() {
        // first part of the query is to get groups i can (directly) communicate with
        // second part is to get groups i can communicate with through a group i belong to
        return "MATCH (g:Group)<-[:COMMUNIQUE]-(u:User { id: {userId}}) " +
                "WHERE exists(g.id) " +
                "OPTIONAL MATCH (sg:Structure)<-[:DEPENDS]-(g) " +
                "OPTIONAL MATCH (sc:Structure)<-[:BELONGS]-(c:Class)<-[:DEPENDS]-(g) " +
                "WITH COALESCE(sg, sc) as s, c, g " +
                "WHERE s.id = {structureId} " +
                "WITH s, c, g " +
                "RETURN DISTINCT " +
                "   g.id as id, " +
                "   g.name as name " +

                "UNION " +

                "MATCH (u:User {id: {userId}})-[:IN]->(ug:Group) " +
                "MATCH (g:Group)<-[:COMMUNIQUE]-(ug) "+
                "WHERE exists(g.id) " +
                "OPTIONAL MATCH (sg:Structure)<-[:DEPENDS]-(ug) " +
                "OPTIONAL MATCH (sc:Structure)<-[:BELONGS]-(c:Class)<-[:DEPENDS]-(ug) " +
                "WITH COALESCE(sg, sc) as s, c, g " +
                "WHERE s.id = {structureId} " +
                "WITH s, c, g " +
                "RETURN DISTINCT " +
                "   g.id as id, " +
                "   g.name as name;";
    }

    private String getQueryGroupsICanCommunicateWithFilterByRight() {
        return
            "MATCH (g:Group)-[:AUTHORIZED]->(:Role)-[:AUTHORIZE]->(wa:WorkflowAction) " +
            "WHERE wa.name = {right} " +
            "AND EXISTS(g.id) " +
            "MATCH (u:User {id: {userId}}) " +
            "OPTIONAL MATCH (u)-[:COMMUNIQUE]->(g) " +
            "OPTIONAL MATCH (u)-[:IN]->(:Group)-[:COMMUNIQUE]->(g) " +
            "WHERE g IS NOT NULL " +
            "RETURN DISTINCT g.id AS id, g.name AS name";
    }


    @Override
    public Future<Optional<NeoStructure>> getStructure(String structureId){
        Promise<Optional<NeoStructure>> promise = Promise.promise();

        String query = "MATCH (s:Structure {id: {structureId}}) " +
                "RETURN s.id as id, s.name as name;";

        JsonObject params = new JsonObject().put(CAMEL_STRUCTURE_ID, structureId);

        String errorMessage = String.format("[Appointments@DefaultCommunicationRepository::getStructure] Fail to retrieve structure with id %s : ", structureId);
        neo4j.execute(query, params, Neo4jResult.validUniqueResultHandler(IModelHelper.uniqueResultToIModel(promise, NeoStructure.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<NeoGroup>> getGroups(List<String> groupIds){
        Promise<List<NeoGroup>> promise = Promise.promise();

        String query = "MATCH (g:Group) " +
                "WHERE g.id IN {groupsIds} " +
                "RETURN g.id as id, g.name as name;";
        JsonObject params = new JsonObject().put(CAMEL_GROUPS_IDS, new JsonArray(groupIds));

        String errorMessage = String.format("[Appointments@DefaultCommunicationRepository::getGroup] Fail to retrieve groups with ids %s : ", groupIds);
        neo4j.execute(query, params, Neo4jResult.validResultHandler(IModelHelper.resultToIModel(promise, NeoGroup.class, errorMessage)));

        return promise.future();
    }
}
