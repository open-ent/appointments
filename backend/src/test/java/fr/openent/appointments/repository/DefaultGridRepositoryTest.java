package fr.openent.appointments.repository;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.core.constants.SqlTables;
import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.repository.impl.DefaultGridRepository;
import fr.openent.appointments.model.payload.GridPayload;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.DateHelper;

import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.sql.Sql;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.stubbing.Answer;
import org.powermock.reflect.Whitebox;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.DateFormat.DATE_TIME_FORMAT_2;
import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.SqlTables.DB_GRID_TABLE;
import static org.mockito.Mockito.*;

@RunWith(VertxUnitRunner.class)
public class DefaultGridRepositoryTest {

    private static final String TEST_GRID_NAME = "gridName";
    private static final String TEST_USER_ID = "userId";
    private static final String TEST_STRUCTURE_ID = "structureId";
    private static final LocalDate TEST_BEGIN_DATE = LocalDate.of(2024, 1, 1);
    private static final LocalDate TEST_END_DATE = LocalDate.of(2024, 1, 31);
    private static final String TEST_COLOR = "blue";
    private static final Duration TEST_DURATION = Duration.ofMinutes(30);
    private static final Periodicity TEST_PERIODICITY = Periodicity.getPeriodicity(1);
    private static final List<String> TEST_TARGET_PUBLIC_IDS = Arrays.asList("1", "2", "3");
    private static final String TEST_VIDEO_CALL_LINK = "http://example.com";
    private static final String TEST_PLACE = "Room A";
    private static final List<String> TEST_DOCUMENTS_IDS = Arrays.asList("1", "2", "3");
    private static final String TEST_PUBLIC_COMMENT = "Comment here";
    private static final String TEST_OPEN_STATE = GridState.OPEN.getValue();
    private static final String TEST_CLOSED_STATE = GridState.CLOSED.getValue();

    
    private Vertx vertx;
    private Sql sql = mock(Sql.class);
    private Neo4j neo4j = mock(Neo4j.class);
    private DefaultGridRepository gridRepository;

    @Before
    public void setUp() {
        vertx = Vertx.vertx();
        Sql.getInstance().init(vertx.eventBus(), APPOINTMENTS_ADDRESS);
        this.gridRepository = new DefaultGridRepository(new RepositoryFactory(sql, neo4j));
    }

    @Test
    public void testGetGridsWithUserIdOnly(TestContext ctx) throws Exception {
        String expectedQuery = "SELECT * FROM " + SqlTables.DB_GRID_TABLE +
                            " WHERE " + Fields.OWNER_ID + " = ?";
        
        JsonArray expectedParams = new JsonArray().add(TEST_USER_ID);

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            Whitebox.invokeMethod(gridRepository, "getMyGridsByName", TEST_USER_ID, null, null);
        } catch (Exception e) {
            ctx.assertNull(e);
        }
    }

    @Test
    public void testGetGridsWithUserIdAndGridName(TestContext ctx) throws Exception {
        String expectedQuery = "SELECT * FROM " + SqlTables.DB_GRID_TABLE +
                            " WHERE " + Fields.OWNER_ID + " = ?" +
                            " AND " + Fields.NAME + " = ?";
        
        JsonArray expectedParams = new JsonArray()
                .add(TEST_USER_ID)
                .add(TEST_GRID_NAME);

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            Whitebox.invokeMethod(gridRepository, "getMyGridsByName", TEST_USER_ID, TEST_GRID_NAME, null);
        } catch (Exception e) {
            ctx.assertNull(e);
        }
    }

    @Test
    public void testGetGridsWithUserIdAndGridStates(TestContext ctx) throws Exception {
        String expectedQuery = "SELECT * FROM " + SqlTables.DB_GRID_TABLE +
                            " WHERE " + Fields.OWNER_ID + " = ?" +
                            " AND " + Fields.STATE + " IN (?,?)";
        
        JsonArray expectedParams = new JsonArray()
                .add(TEST_USER_ID)
                .add(TEST_OPEN_STATE)
                .add(TEST_CLOSED_STATE);

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            List<GridState> states = Arrays.asList(GridState.OPEN, GridState.CLOSED);
            Whitebox.invokeMethod(gridRepository, "getMyGridsByName", TEST_USER_ID, null, states);
        } catch (Exception e) {
            ctx.assertNull(e);
        }
    }

    @Test
    public void testGetGridsWithUserIdGridNameAndStates(TestContext ctx) throws Exception {
        String expectedQuery = "SELECT * FROM " + SqlTables.DB_GRID_TABLE +
                            " WHERE " + Fields.OWNER_ID + " = ?" +
                            " AND " + Fields.NAME + " = ?" +
                            " AND " + Fields.STATE + " IN (?,?)";
        
        JsonArray expectedParams = new JsonArray()
                .add(TEST_USER_ID)
                .add(TEST_GRID_NAME)
                .add(TEST_OPEN_STATE)
                .add(TEST_CLOSED_STATE);

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            List<GridState> states = Arrays.asList(GridState.OPEN, GridState.CLOSED);
            Whitebox.invokeMethod(gridRepository, "getMyGridsByName", TEST_USER_ID, TEST_GRID_NAME, states);
        } catch (Exception e) {
            ctx.assertNull(e);
        }
    }

    @Test
    public void testInsert(TestContext ctx) throws Exception {
        GridPayload grid = mock(GridPayload.class);
        when(grid.getGridName()).thenReturn(TEST_GRID_NAME);
        when(grid.getStructureId()).thenReturn(TEST_STRUCTURE_ID);
        when(grid.getBeginDate()).thenReturn(TEST_BEGIN_DATE);
        when(grid.getEndDate()).thenReturn(TEST_END_DATE);
        when(grid.getColor()).thenReturn(TEST_COLOR);
        when(grid.getDuration()).thenReturn(TEST_DURATION);
        when(grid.getPeriodicity()).thenReturn(TEST_PERIODICITY);
        when(grid.getTargetPublicIds()).thenReturn(TEST_TARGET_PUBLIC_IDS);
        when(grid.getVideoCallLink()).thenReturn(TEST_VIDEO_CALL_LINK);
        when(grid.getPlace()).thenReturn(TEST_PLACE);
        when(grid.getDocumentsIds()).thenReturn(TEST_DOCUMENTS_IDS);
        when(grid.getPublicComment()).thenReturn(TEST_PUBLIC_COMMENT);

        List<String> sqlColumns = Arrays.asList(NAME, OWNER_ID, STRUCTURE_ID, BEGIN_DATE, END_DATE, CREATION_DATE, UPDATING_DATE,
                COLOR, DURATION, PERIODICITY, TARGET_PUBLIC_LIST_ID, VIDEO_CALL_LINK, PLACE, DOCUMENTS_IDS, PUBLIC_COMMENT, STATE);

        String expectedQuery = "INSERT INTO "+ DB_GRID_TABLE + " (" + String.join(", ", sqlColumns) + ") " +
                "VALUES " + Sql.listPrepared(sqlColumns) + " RETURNING *";

        String frenchNow = ZonedDateTime.now(ZoneId.of(FRENCH_TIME_ZONE))
                .format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT_2));

        JsonArray expectedParams = new JsonArray()
                .add(TEST_GRID_NAME)
                .add(TEST_USER_ID)
                .add(TEST_STRUCTURE_ID)
                .add(DateHelper.formatDate(TEST_BEGIN_DATE))
                .add(DateHelper.formatDate(TEST_END_DATE))
                .add(frenchNow)
                .add(frenchNow)
                .add(TEST_COLOR)
                .add(DateHelper.formatDuration(TEST_DURATION))
                .add(TEST_PERIODICITY.getValue())
                .add(TEST_TARGET_PUBLIC_IDS.toString())
                .add(TEST_VIDEO_CALL_LINK)
                .add(TEST_PLACE)
                .add(TEST_DOCUMENTS_IDS.toString())
                .add(TEST_PUBLIC_COMMENT)
                .add(GridState.OPEN.getValue());

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            Whitebox.invokeMethod(gridRepository, "insert", grid, TEST_USER_ID);
        }
        catch (Exception e) {
            ctx.assertNull(e);
        }
    }
}
