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

    public Future<JsonArray> getVisibleGroups(String userId) {
        Promise<JsonArray> promise = Promise.promise();
        String query = "MATCH (g:CommunityGroup:Group:Visible {type: 'manager'})<-[r:IN|COMMUNIQUE]-(u:User {id: {userId}}) " +
		"RETURN DISTINCT g.id as id, g.name as name, g.displayNameSearchField as displayName, g.nbUsers as nbUsers ORDER BY name";

		JsonObject params = new JsonObject().put(Fields.CAMEL_USER_ID, userId);
        
        String errorMessage = "[Appointments@DefaultCommunicationRepository::getVisibleGroups] Fail to retrieve visible groups : ";
        neo4j.execute(query, params, Neo4jResult.validResultHandler(FutureHelper.handlerEither(promise, errorMessage)));

        return promise.future();
    }

}
