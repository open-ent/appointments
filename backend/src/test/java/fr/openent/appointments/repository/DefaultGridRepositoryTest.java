package fr.openent.appointments.repository;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.core.constants.SqlTables;
import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.repository.impl.DefaultGridRepository;
import fr.openent.appointments.model.payload.GridPayload;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.enums.Day;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.model.database.DailySlot;
import fr.openent.appointments.model.TransactionElement;

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

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

import static fr.openent.appointments.core.constants.Constants.APPOINTMENTS_ADDRESS;
import static org.mockito.Mockito.*;

@RunWith(VertxUnitRunner.class)
public class DefaultGridRepositoryTest {

    private static final String GRID_NAME = "gridName";
    private static final String USER_ID = "userId";
    private static final String STRUCTURE_ID = "structureId";
    private static final LocalDate BEGIN_DATE = LocalDate.of(2024, 1, 1);
    private static final LocalDate END_DATE = LocalDate.of(2024, 1, 31);
    private static final String COLOR = "blue";
    private static final Duration DURATION = Duration.ofMinutes(30);
    private static final Periodicity PERIODICITY = Periodicity.getPeriodicity(1);
    private static final List<String> TARGET_PUBLIC_IDS = Arrays.asList("1", "2", "3");
    private static final String VISIO_LINK = "http://example.com";
    private static final String PLACE = "Room A";
    private static final String DOCUMENT_ID = "docId";
    private static final String PUBLIC_COMMENT = "Comment here";
    private static final String OPEN_STATE = GridState.OPEN.getValue();
    private static final String SUSPENDED_STATE = GridState.SUSPENDED.getValue();
    private static final String CLOSED_STATE = GridState.CLOSED.getValue();

    
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
        
        JsonArray expectedParams = new JsonArray().add(USER_ID);

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            Whitebox.invokeMethod(gridRepository, "getGrids", USER_ID);
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
                .add(USER_ID)
                .add(GRID_NAME);

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            Whitebox.invokeMethod(gridRepository, "getGrids", USER_ID, GRID_NAME, null);
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
                .add(USER_ID)
                .add(OPEN_STATE)
                .add(CLOSED_STATE);

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            List<GridState> states = Arrays.asList(GridState.OPEN, GridState.CLOSED);
            Whitebox.invokeMethod(gridRepository, "getGrids", USER_ID, null, states);
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
                .add(USER_ID)
                .add(GRID_NAME)
                .add(OPEN_STATE)
                .add(CLOSED_STATE);

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            List<GridState> states = Arrays.asList(GridState.OPEN, GridState.CLOSED);
            Whitebox.invokeMethod(gridRepository, "getGrids", USER_ID, GRID_NAME, states);
        } catch (Exception e) {
            ctx.assertNull(e);
        }
    }

    @Test
    public void testInsert(TestContext ctx) throws Exception {
        GridPayload grid = mock(GridPayload.class);
        when(grid.getGridName()).thenReturn(GRID_NAME);
        when(grid.getStructureId()).thenReturn(STRUCTURE_ID);
        when(grid.getBeginDate()).thenReturn(BEGIN_DATE);
        when(grid.getEndDate()).thenReturn(END_DATE);
        when(grid.getColor()).thenReturn(COLOR);
        when(grid.getDuration()).thenReturn(DURATION);
        when(grid.getPeriodicity()).thenReturn(PERIODICITY);
        when(grid.getTargetPublicIds()).thenReturn(TARGET_PUBLIC_IDS);
        when(grid.getVisioLink()).thenReturn(VISIO_LINK);
        when(grid.getPlace()).thenReturn(PLACE);
        when(grid.getDocumentId()).thenReturn(DOCUMENT_ID);
        when(grid.getPublicComment()).thenReturn(PUBLIC_COMMENT);

        String expectedQuery = "INSERT INTO " + SqlTables.DB_GRID_TABLE + " (" +
                Fields.NAME + ", " +
                Fields.OWNER_ID + ", " +
                Fields.STRUCTURE_ID + ", " +
                Fields.BEGIN_DATE + ", " +
                Fields.END_DATE + ", " +
                Fields.COLOR + ", " +
                Fields.DURATION + ", " +
                Fields.PERIODICITY + ", " +
                Fields.TARGET_PUBLIC_LIST_ID + ", " +
                Fields.VISIO_LINK + ", " +
                Fields.PLACE + ", " +
                Fields.DOCUMENT_ID + ", " +
                Fields.PUBLIC_COMMENT + ", " +
                Fields.STATE + ") " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";

        JsonArray expectedParams = new JsonArray()
                .add(GRID_NAME)
                .add(USER_ID)
                .add(STRUCTURE_ID)
                .add(DateHelper.formatDate(BEGIN_DATE))
                .add(DateHelper.formatDate(END_DATE))
                .add(COLOR)
                .add(DateHelper.formatDuration(DURATION))
                .add(PERIODICITY.getValue())
                .add(TARGET_PUBLIC_IDS.toString())
                .add(VISIO_LINK)
                .add(PLACE)
                .add(DOCUMENT_ID)
                .add(PUBLIC_COMMENT)
                .add(GridState.OPEN.getValue());

        doAnswer((Answer<Void>) invocation -> {
            String queryResult = invocation.getArgument(0);
            JsonArray paramsResult = invocation.getArgument(1);
            ctx.assertEquals(expectedQuery, queryResult);
            ctx.assertEquals(expectedParams.toString(), paramsResult.toString());
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            Whitebox.invokeMethod(gridRepository, "insert", grid, USER_ID);
        }
        catch (Exception e) {
            ctx.assertNull(e);
        }
    }

    @Test
    public void testInsertDailySlots(TestContext ctx) throws Exception {
        Long gridId = 1L;

        DailySlot dailySlot1 = mock(DailySlot.class);
        when(dailySlot1.getDay()).thenReturn(Day.getDay("MONDAY"));
        when(dailySlot1.getBeginTime()).thenReturn(LocalTime.of(8, 0));
        when(dailySlot1.getEndTime()).thenReturn(LocalTime.of(12, 0));

        DailySlot dailySlot2 = mock(DailySlot.class);
        when(dailySlot2.getDay()).thenReturn(Day.getDay("TUESDAY"));
        when(dailySlot2.getBeginTime()).thenReturn(LocalTime.of(14, 0));
        when(dailySlot2.getEndTime()).thenReturn(LocalTime.of(18, 0));

        List<DailySlot> dailySlots = Arrays.asList(dailySlot1, dailySlot2);

        String expectedQuery = "INSERT INTO " + SqlTables.DB_DAILY_SLOT_TABLE + " (" +
            Fields.DAY + ", " +
            Fields.BEGIN_TIME + ", " +
            Fields.END_TIME + ", " +
            Fields.GRID_ID + ") VALUES (?, ?, ?, ?)";

        List<JsonArray> expectedParamsList = new ArrayList<>();
        expectedParamsList.add(new JsonArray()
                .add(dailySlot1.getDay().toString())
                .add(DateHelper.formatTime(dailySlot1.getBeginTime()))
                .add(DateHelper.formatTime(dailySlot1.getEndTime()))
                .add(gridId));

        expectedParamsList.add(new JsonArray()
                .add(dailySlot2.getDay().toString())
                .add(DateHelper.formatTime(dailySlot2.getBeginTime()))
                .add(DateHelper.formatTime(dailySlot2.getEndTime()))
                .add(gridId));

        doAnswer((Answer<Void>) invocation -> {
            List<TransactionElement> transactionElements = invocation.getArgument(0);
            ctx.assertEquals(2, transactionElements.size());
            for (int i = 0; i < transactionElements.size(); i++) {
                TransactionElement transactionElement = transactionElements.get(i);
                String queryResult = transactionElement.getQuery();
                JsonArray paramsResult = transactionElement.getParams();
                ctx.assertEquals(expectedQuery, queryResult);
                ctx.assertEquals(expectedParamsList.get(i).toString(), paramsResult.toString());
            }
            return null;
        }).when(sql).prepared(anyString(), any(JsonArray.class), any(Handler.class));

        try {
            Whitebox.invokeMethod(gridRepository, "insertDailySlots", gridId, dailySlots);
        }
        catch (Exception e) {
            ctx.assertNull(e);
        }
    }
}
