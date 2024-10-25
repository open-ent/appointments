package fr.openent.appointments.repository.impl;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.core.constants.SqlTables;
import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.repository.RepositoryFactory;
import fr.openent.appointments.repository.impl.DefaultGridRepository;
import fr.openent.appointments.model.payload.GridPayload;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.enums.Day;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.model.DailySlot;
import fr.openent.appointments.model.TransactionElement;

import io.vertx.core.Handler;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.neo4j.Neo4jRest;
import org.entcore.common.sql.Sql;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.internal.util.reflection.FieldSetter;
import org.mockito.stubbing.Answer;
import org.powermock.reflect.Whitebox;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

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
    public void testGetVisibleGroups(TestContext ctx) {
        String expectedQuery = "MATCH (g:CommunityGroup:Group:Visible {type: 'manager'})<-[r:IN|COMMUNIQUE]-(u:User {id: {userId}}) " +
                "RETURN DISTINCT g.id as id, g.name as name, g.displayNameSearchField as displayName, g.nbUsers as nbUsers ORDER BY name";

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            ctx.assertEquals(expectedQuery, queryResult);
            return null;
        }).when(neo4jRest).execute(anyString(), any(JsonObject.class), any(Handler.class));

        this.communicationRepository.getVisibleGroups("userId");
    }
}