package fr.openent.appointments.repository;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.repository.impl.DefaultCommunicationRepository;

import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.neo4j.Neo4jRest;
import org.entcore.common.sql.Sql;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.stubbing.Answer;

import static org.mockito.Mockito.*;

@RunWith(VertxUnitRunner.class)
public class DefaultCommunicationRepositoryTest {

    private Vertx vertx;
    private Sql sql = mock(Sql.class);
    private Neo4j neo4j = mock(Neo4j.class);
    private Neo4jRest neo4jRest = mock(Neo4jRest.class);
    private DefaultCommunicationRepository communicationRepository;

    @Before
    public void setUp() {
        vertx = Vertx.vertx();
        RepositoryFactory repositoryFactory = new RepositoryFactory(sql, neo4j);
        communicationRepository = new DefaultCommunicationRepository(repositoryFactory);
    }

    @Test
    public void testGetGroupsCanCommunicateWithMe(TestContext ctx) {
        String userId = Fields.USER_ID;
        String structureId = Fields.STRUCTURE_ID;
        String expectedQuery = "MATCH (g:Group)<-[:COMMUNIQUE]-(u:User { id: {userId}}) " +
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

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            String paramsResult = invocation.getArgument(1);

            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(params.encode(), paramsResult);

            return null;

        } ).when(neo4jRest).execute(anyString(), any(JsonObject.class), any(Handler.class));

        this.communicationRepository.getGroupsCanCommunicateWithMe(userId, structureId);
    }
}