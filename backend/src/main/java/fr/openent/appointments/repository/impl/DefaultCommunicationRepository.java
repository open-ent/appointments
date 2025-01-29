package fr.openent.appointments.repository.impl;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.database.NeoGroup;
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

    public Future<List<NeoGroup>> getGroupsCanCommunicateWithMe(String userId, String structureId) {
        Promise<List<NeoGroup>> promise = Promise.promise();

        String query = getCommunicationQuery(true, structureId);
        JsonObject params = new JsonObject()
                .put(CAMEL_USER_ID, userId)
                .put(CAMEL_STRUCTURE_ID, structureId);

        String errorMessage = "[Appointments@DefaultCommunicationRepository::getGroupsCanCommunicateWithMe] Fail to retrieve visible groups : ";
        neo4j.execute(query, params, Neo4jResult.validResultHandler(IModelHelper.sqlResultToIModel(promise, NeoGroup.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<NeoGroup>> getGroupsICanCommunicateWith(String userId) {
        Promise<List<NeoGroup>> promise = Promise.promise();

        String query = getCommunicationQuery(false, null);
        JsonObject params = new JsonObject().put(CAMEL_USER_ID, userId);

        String errorMessage = "[Appointments@DefaultCommunicationRepository::getGroupsICanCommunicateWith] Fail to retrieve groups : ";
        neo4j.execute(query, params, Neo4jResult.validResultHandler(IModelHelper.sqlResultToIModel(promise, NeoGroup.class, errorMessage)));

        return promise.future();
    }

    @Override
    public Future<List<NeoUser>> getUsersFromGroupsIds(List<String> groupsIds, List<String> structuresIds) {
        Promise<List<NeoUser>> promise = Promise.promise();

        String query =
                "MATCH (s:Structure) " +
                "WHERE s.id IN {structuresIds} " +
                "WITH collect(s.externalId) AS structuresExternalIds " +

                "MATCH (g:Group)<-[:IN]-(u:User) " +
                "WHERE g.id IN {groupsIds} " +
                "OPTIONAL MATCH (u)-[:USERBOOK]->(ub:UserBook) " +
                "WITH u, ub, [func IN u.functions WHERE split(func, \"$\")[0] IN structuresExternalIds] AS filteredFunctions " +
                "RETURN u.id AS id, u.displayName AS displayName, filteredFunctions AS functions, ub.picture AS picture, u.profiles as profiles;";
        JsonObject params = new JsonObject().put(CAMEL_GROUPS_IDS, groupsIds).put(CAMEL_STRUCTURES_IDS, structuresIds);

        String errorMessage = "[Appointments@DefaultCommunicationRepository::getUsersFromGroupsIds] Fail to retrieve users infos from groups ids : ";
        neo4j.execute(query, params, Neo4jResult.validResultHandler(IModelHelper.sqlResultToIModel(promise, NeoUser.class, errorMessage)));

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
        neo4j.execute(query, params, Neo4jResult.validUniqueResultHandler(IModelHelper.sqlUniqueResultToIModel(promise, NeoUser.class, errorMessage)));

        return promise.future();
    }

    private String getCommunicationQuery(boolean isIncoming, String structureId) {
        // first part of the query is to get groups that can communicate with me
        // second part is to get groups that can communicate with groups I am in
        // third part is to get groups I am in
        return "MATCH (g:Group)"+ (isIncoming ? "-[:COMMUNIQUE]-> " : "<-[:COMMUNIQUE]- ")+ "(u:User { id: {userId}}) " +
                "WHERE exists(g.id) " +
                "OPTIONAL MATCH (sg:Structure)<-[:DEPENDS]-(g) " +
                "OPTIONAL MATCH (sc:Structure)<-[:BELONGS]-(c:Class)<-[:DEPENDS]-(g) " +
                "WITH COALESCE(sg, sc) as s, c, g " +
                (structureId != null ? "WHERE s.id = {structureId} " : "") +
                "WITH s, c, g " +
                "RETURN DISTINCT " +
                "   g.id as id, " +
                "   g.name as name " +

                "UNION " +

                "MATCH (u:User {id: {userId}})-[:IN]->(ug:Group) " +
                "MATCH (g:Group)" + (isIncoming ? "-[:COMMUNIQUE]->(ug) " : "<-[:COMMUNIQUE]-(ug) ")+
                "WHERE exists(g.id) " +
                "OPTIONAL MATCH (sg:Structure)<-[:DEPENDS]-(g) " +
                "OPTIONAL MATCH (sc:Structure)<-[:BELONGS]-(c:Class)<-[:DEPENDS]-(g) " +
                "WITH COALESCE(sg, sc) as s, c, g " +
                (structureId != null ? "WHERE s.id = {structureId} " : "") +
                "WITH s, c, g " +
                "RETURN DISTINCT " +
                "   g.id as id, " +
                "   g.name as name " +

                "UNION " +

                "MATCH (u:User {id: {userId}})-[:IN]->(g:Group) " +
                "WHERE exists(g.id) " +
                "OPTIONAL MATCH (sg:Structure)<-[:DEPENDS]-(g) " +
                "OPTIONAL MATCH (sc:Structure)<-[:BELONGS]-(c:Class)<-[:DEPENDS]-(g) " +
                "WITH COALESCE(sg, sc) as s, c, g " +
                (structureId != null ? "WHERE s.id = {structureId} " : "") +
                "WITH s, c, g " +
                "RETURN DISTINCT " +
                "   g.id as id, " +
                "   g.name as name;";
    }
}
