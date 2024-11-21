package fr.openent.appointments.repository;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.core.constants.SqlTables;
import fr.openent.appointments.enums.Day;
import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.model.TransactionElement;
import fr.openent.appointments.model.payload.DailySlotPayload;
import fr.openent.appointments.model.payload.GridPayload;
import fr.openent.appointments.repository.impl.DefaultDailySlotRepository;
import fr.openent.appointments.repository.impl.DefaultGridRepository;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static fr.openent.appointments.core.constants.Constants.APPOINTMENTS_ADDRESS;
import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.SqlTables.DB_GRID_TABLE;
import static org.mockito.Mockito.*;

@RunWith(VertxUnitRunner.class)
public class DefaultDailySlotRepositoryTest {

    private static final String TEST_GRID_NAME = "gridName";
    private static final String TEST_USER_ID = "userId";
    private static final String TEST_STRUCTURE_ID = "structureId";
    private static final LocalDate TEST_BEGIN_DATE = LocalDate.of(2024, 1, 1);
    private static final LocalDate TEST_END_DATE = LocalDate.of(2024, 1, 31);
    private static final String TEST_COLOR = "blue";
    private static final Duration TEST_DURATION = Duration.ofMinutes(30);
    private static final Periodicity TEST_PERIODICITY = Periodicity.getPeriodicity(1);
    private static final List<String> TEST_TARGET_PUBLIC_IDS = Arrays.asList("1", "2", "3");
    private static final String TEST_VISIO_LINK = "http://example.com";
    private static final String TEST_PLACE = "Room A";
    private static final String TEST_DOCUMENT_ID = "docId";
    private static final String TEST_PUBLIC_COMMENT = "Comment here";
    private static final String TEST_OPEN_STATE = GridState.OPEN.getValue();
    private static final String TEST_SUSPENDED_STATE = GridState.SUSPENDED.getValue();
    private static final String TEST_CLOSED_STATE = GridState.CLOSED.getValue();

    
    private Vertx vertx;
    private Sql sql = mock(Sql.class);
    private Neo4j neo4j = mock(Neo4j.class);
    private DefaultDailySlotRepository dailySlotRepository;

    @Before
    public void setUp() {
        vertx = Vertx.vertx();
        Sql.getInstance().init(vertx.eventBus(), APPOINTMENTS_ADDRESS);
        this.dailySlotRepository = new DefaultDailySlotRepository(new RepositoryFactory(sql, neo4j));
    }

    @Test
    public void testCreate(TestContext ctx) throws Exception {
        Long gridId = 1L;

        DailySlotPayload dailySlot1 = mock(DailySlotPayload.class);
        when(dailySlot1.getDay()).thenReturn(Day.getDay("MONDAY"));
        when(dailySlot1.getBeginTime()).thenReturn(LocalTime.of(8, 0));
        when(dailySlot1.getEndTime()).thenReturn(LocalTime.of(12, 0));

        DailySlotPayload dailySlot2 = mock(DailySlotPayload.class);
        when(dailySlot2.getDay()).thenReturn(Day.getDay("TUESDAY"));
        when(dailySlot2.getBeginTime()).thenReturn(LocalTime.of(14, 0));
        when(dailySlot2.getEndTime()).thenReturn(LocalTime.of(18, 0));

        List<DailySlotPayload> dailySlots = Arrays.asList(dailySlot1, dailySlot2);

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
            Whitebox.invokeMethod(dailySlotRepository, "create", gridId, dailySlots);
        }
        catch (Exception e) {
            ctx.assertNull(e);
        }
    }
}
