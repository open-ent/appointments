package fr.openent.appointments.model.payload;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.model.DailySlot;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

@RunWith(VertxUnitRunner.class)
public class GridPayloadTest {

    @Test
    public void testValidGridPayloadCreation(TestContext ctx) {
        JsonObject validJson = new JsonObject()
            .put(Fields.NAME, "Test Grid")
            .put(Fields.CAMEL_BEGIN_DATE, "2024-10-01")
            .put(Fields.CAMEL_END_DATE, "2024-10-31")
            .put(Fields.COLOR, "blue")
            .put(Fields.CAMEL_STRUCTURE_ID, "structure-1")
            .put(Fields.DURATION, "01:00")
            .put(Fields.PERIODICITY, Periodicity.WEEKLY.getValue())
            .put(Fields.CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(Arrays.asList("public-1", "public-2")))
            .put(Fields.CAMEL_DAILY_SLOTS, new JsonArray(Collections.singletonList(new JsonObject()
                .put(Fields.DAY, "MONDAY")
                .put(Fields.CAMEL_BEGIN_TIME, "09:00")
                .put(Fields.CAMEL_END_TIME, "17:00"))))
            .put(Fields.CAMEL_VISIO_LINK, "http://example.com")
            .put(Fields.PLACE, "Office")
            .put(Fields.CAMEL_DOCUMENT_ID, "doc-123")
            .put(Fields.CAMEL_PUBLIC_COMMENT, "Test comment");

        GridPayload gridPayload = new GridPayload(validJson);
        
        ctx.assertEquals("Test Grid", gridPayload.getGridName());
        ctx.assertEquals(LocalDate.of(2024, 10, 1), gridPayload.getBeginDate());
        ctx.assertEquals(LocalDate.of(2024, 10, 31), gridPayload.getEndDate());
        ctx.assertEquals("blue", gridPayload.getColor());
        ctx.assertEquals("structure-1", gridPayload.getStructureId());
        ctx.assertEquals(Duration.ofHours(1), gridPayload.getDuration());
        ctx.assertEquals(Periodicity.WEEKLY, gridPayload.getPeriodicity());
        ctx.assertEquals(Arrays.asList("public-1", "public-2"), gridPayload.getTargetPublicIds());
        ctx.assertFalse(gridPayload.getDailySlots().isEmpty());
        ctx.assertEquals("http://example.com", gridPayload.getVisioLink());
        ctx.assertEquals("Office", gridPayload.getPlace());
        ctx.assertEquals("doc-123", gridPayload.getDocumentId());
        ctx.assertEquals("Test comment", gridPayload.getPublicComment());
        ctx.assertTrue(gridPayload.isValid());
    }

    @Test
    public void testInvalidGridPayloadCreationMissingFields(TestContext ctx) {
        JsonObject invalidJson = new JsonObject()
            .put(Fields.NAME, "")
            .put(Fields.CAMEL_BEGIN_DATE, "2024-10-01")
            .put(Fields.CAMEL_END_DATE, "2024-10-31")
            .put(Fields.COLOR, "blue")
            .put(Fields.CAMEL_STRUCTURE_ID, "")
            .put(Fields.DURATION, "")
            .put(Fields.PERIODICITY, 0)
            .put(Fields.CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(Arrays.asList("public-1")))
            .put(Fields.CAMEL_DAILY_SLOTS, new JsonArray(Arrays.asList(
                new JsonObject()
                    .put(Fields.DAY, "MONDAY")
                    .put(Fields.CAMEL_BEGIN_TIME, "09:00")
                    .put(Fields.CAMEL_END_TIME, "17:00")
            )))
            .put(Fields.CAMEL_VISIO_LINK, "http://example.com")
            .put(Fields.PLACE, "Office")
            .put(Fields.CAMEL_DOCUMENT_ID, "doc-123")
            .put(Fields.CAMEL_PUBLIC_COMMENT, "Test comment");

        GridPayload gridPayload = new GridPayload(invalidJson);
        ctx.assertFalse(gridPayload.isValid());
    }

    @Test
    public void testValidDailySlotsInGridPayload(TestContext ctx) {
        JsonObject dailySlotJson = new JsonObject()
            .put(Fields.DAY, "TUESDAY")
            .put(Fields.CAMEL_BEGIN_TIME, "10:00")
            .put(Fields.CAMEL_END_TIME, "18:00");

        GridPayload gridPayload = new GridPayload(new JsonObject()
            .put(Fields.NAME, "Test Grid")
            .put(Fields.CAMEL_BEGIN_DATE, "2024-10-01")
            .put(Fields.CAMEL_END_DATE, "2024-10-31")
            .put(Fields.COLOR, "blue")
            .put(Fields.CAMEL_STRUCTURE_ID, "structure-1")
            .put(Fields.DURATION, "01:00")
            .put(Fields.PERIODICITY, Periodicity.WEEKLY.getValue())
            .put(Fields.CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(Arrays.asList("public-1")))
            .put(Fields.CAMEL_DAILY_SLOTS, new JsonArray(Collections.singletonList(dailySlotJson))));

        ctx.assertTrue(gridPayload.getDailySlots().stream().allMatch(DailySlot::isValid));
    }

    @Test
    public void testGridPayloadToString(TestContext ctx) {
        JsonObject validJson = new JsonObject()
            .put(Fields.NAME, "Test Grid")
            .put(Fields.CAMEL_BEGIN_DATE, "2024-10-01")
            .put(Fields.CAMEL_END_DATE, "2024-10-31")
            .put(Fields.COLOR, "blue")
            .put(Fields.CAMEL_STRUCTURE_ID, "structure-1")
            .put(Fields.DURATION, "01:00")
            .put(Fields.PERIODICITY, Periodicity.WEEKLY.getValue())
            .put(Fields.CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(Arrays.asList("public-1")))
            .put(Fields.CAMEL_DAILY_SLOTS, new JsonArray(Arrays.asList(
                new JsonObject()
                    .put(Fields.DAY, "MONDAY")
                    .put(Fields.CAMEL_BEGIN_TIME, "09:00")
                    .put(Fields.CAMEL_END_TIME, "17:00")
            )))
            .put(Fields.CAMEL_VISIO_LINK, "http://example.com")
            .put(Fields.PLACE, "Office")
            .put(Fields.CAMEL_DOCUMENT_ID, "doc-123")
            .put(Fields.CAMEL_PUBLIC_COMMENT, "Test comment");

        GridPayload gridPayload = new GridPayload(validJson);
        String expectedJsonString = gridPayload.toString(); // Generate the expected string from the method
        ctx.assertNotNull(expectedJsonString);
        ctx.assertTrue(expectedJsonString.contains("Test Grid"));
        ctx.assertTrue(expectedJsonString.contains("2024-10-01"));
        ctx.assertTrue(expectedJsonString.contains("blue"));
    }
}
