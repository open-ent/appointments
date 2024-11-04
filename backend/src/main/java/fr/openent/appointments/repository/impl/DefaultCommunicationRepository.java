package fr.openent.appointments.repository.impl;

import fr.openent.appointments.repository.CommunicationRepository;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.helper.FutureHelper;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import fr.wseduc.webutils.Either;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.neo4j.Neo4jResult;
import fr.openent.appointments.core.constants.Fields;

public class DefaultCommunicationRepository implements CommunicationRepository {

    private final Neo4j neo4j;

    public DefaultCommunicationRepository(RepositoryFactory repositoryFactory) {
        this.neo4j = repositoryFactory.neo4j();
    }

    public Future<JsonArray> getGroupsCanCommunicateWithMe(String userId, String structureId) {
        Promise<JsonArray> promise = Promise.promise();

        String query = "MATCH (g:Group)<-[:COMMUNIQUE]-(u:User { id: {userId}}) " +
                "WHERE exists(g.id) " +
                "OPTIONAL MATCH (sg:Structure)<-[:DEPENDS]-(g) " +
                "OPTIONAL MATCH (sc:Structure)<-[:BELONGS]-(c:Class)<-[:DEPENDS]-(g) " +
                "WITH COALESCE(sg, sc) as s, c, g " +
                "WHERE s.id = {structureId} " +
                "WITH s, c, g " +
                "RETURN DISTINCT " +
                "     g.id as id, " +
                "     g.name as name " +

                "UNION " +

                "MATCH (u:User {id: {userId}})-[:IN]->(ug:Group) " +
                "MATCH (g:Group)-[:COMMUNIQUE]->(ug) " +
                "WHERE exists(g.id) " +
                "OPTIONAL MATCH (sg:Structure)<-[:DEPENDS]-(g) " +
                "OPTIONAL MATCH (sc:Structure)<-[:BELONGS]-(c:Class)<-[:DEPENDS]-(g) " +
                "WITH COALESCE(sg, sc) as s, c, g " +
                "WHERE s.id = {structureId} " +
                "WITH s, c, g " +
                "RETURN DISTINCT " +
                "     g.id as id, " +
                "     g.name as name";

        JsonObject params = new JsonObject()
                .put(Fields.CAMEL_USER_ID, userId)
                .put(Fields.CAMEL_STRUCTURE_ID, structureId);

        String errorMessage = "[Appointments@DefaultCommunicationRepository::getGroupsCanCommunicateWithMe] Fail to retrieve visible groups : ";
        neo4j.execute(query, params, Neo4jResult.validResultHandler(FutureHelper.handlerEither(promise, errorMessage)));

        return promise.future();
    }


}
