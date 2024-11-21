package fr.openent.appointments.model.payload;

import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.LogHelper;
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
import java.util.stream.Collectors;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.Fields.*;

@RunWith(VertxUnitRunner.class)
public class GridPayloadTest {

    @Test
    public void testValidGridPayloadCreation(TestContext ctx) {
        JsonObject validJson = new JsonObject()
            .put(NAME, "Test Grid")
            .put(CAMEL_BEGIN_DATE, "2024-10-01")
            .put(CAMEL_END_DATE, "2024-10-31")
            .put(COLOR, "blue")
            .put(CAMEL_STRUCTURE_ID, "structure-1")
            .put(DURATION, "01:00")
            .put(PERIODICITY, Periodicity.WEEKLY.getValue())
            .put(CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(Arrays.asList("public-1", "public-2")))
            .put(CAMEL_DAILY_SLOTS, new JsonArray(Collections.singletonList(new JsonObject()
                .put(DAY, "MONDAY")
                .put(CAMEL_BEGIN_TIME, "09:00")
                .put(CAMEL_END_TIME, "17:00"))))
            .put(CAMEL_VISIO_LINK, "http://example.com")
            .put(PLACE, "Office")
            .put(CAMEL_DOCUMENT_ID, "doc-123")
            .put(CAMEL_PUBLIC_COMMENT, "Test comment");

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
            .put(NAME, "")
            .put(CAMEL_BEGIN_DATE, "2024-10-01")
            .put(CAMEL_END_DATE, "2024-10-31")
            .put(COLOR, "blue")
            .put(CAMEL_STRUCTURE_ID, "")
            .put(DURATION, "")
            .put(PERIODICITY, 0)
            .put(CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(Arrays.asList("public-1")))
            .put(CAMEL_DAILY_SLOTS, new JsonArray(Arrays.asList(
                new JsonObject()
                    .put(DAY, "MONDAY")
                    .put(CAMEL_BEGIN_TIME, "09:00")
                    .put(CAMEL_END_TIME, "17:00")
            )))
            .put(CAMEL_VISIO_LINK, "http://example.com")
            .put(PLACE, "Office")
            .put(CAMEL_DOCUMENT_ID, "doc-123")
            .put(CAMEL_PUBLIC_COMMENT, "Test comment");

        GridPayload gridPayload = new GridPayload(invalidJson);
        ctx.assertFalse(gridPayload.isValid());
    }

    @Test
    public void testValidDailySlotsInGridPayload(TestContext ctx) {
        JsonObject dailySlotJson = new JsonObject()
            .put(DAY, "TUESDAY")
            .put(CAMEL_BEGIN_TIME, "10:00")
            .put(CAMEL_END_TIME, "18:00");

        GridPayload gridPayload = new GridPayload(new JsonObject()
            .put(NAME, "Test Grid")
            .put(CAMEL_BEGIN_DATE, "2024-10-01")
            .put(CAMEL_END_DATE, "2024-10-31")
            .put(COLOR, "blue")
            .put(CAMEL_STRUCTURE_ID, "structure-1")
            .put(DURATION, "01:00")
            .put(PERIODICITY, Periodicity.WEEKLY.getValue())
            .put(CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(Arrays.asList("public-1")))
            .put(CAMEL_DAILY_SLOTS, new JsonArray(Collections.singletonList(dailySlotJson))));

        ctx.assertTrue(gridPayload.getDailySlots().stream().allMatch(DailySlotPayload::isValid));
    }

    @Test
    public void testGridPayloadToString(TestContext ctx) {
        JsonObject validJson = new JsonObject()
            .put(NAME, "Test Grid")
            .put(CAMEL_BEGIN_DATE, "2024-10-01")
            .put(CAMEL_END_DATE, "2024-10-31")
            .put(COLOR, "blue")
            .put(CAMEL_STRUCTURE_ID, "structure-1")
            .put(DURATION, "01:00")
            .put(PERIODICITY, Periodicity.WEEKLY.getValue())
            .put(CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(Arrays.asList("public-1")))
            .put(CAMEL_DAILY_SLOTS, new JsonArray(Arrays.asList(
                new JsonObject()
                    .put(DAY, "MONDAY")
                    .put(CAMEL_BEGIN_TIME, "09:00")
                    .put(CAMEL_END_TIME, "17:00")
            )))
            .put(CAMEL_VISIO_LINK, "http://example.com")
            .put(PLACE, "Office")
            .put(CAMEL_DOCUMENT_ID, "doc-123")
            .put(CAMEL_PUBLIC_COMMENT, "Test comment");

        GridPayload gridPayload = new GridPayload(validJson);
        gridPayload.buildTimeSlots();

        String expectedJsonString = gridPayload.toString(); // Generate the expected string from the method
        ctx.assertNotNull(expectedJsonString);
        ctx.assertTrue(expectedJsonString.contains("Test Grid"));
        ctx.assertTrue(expectedJsonString.contains("2024-10-01"));
        ctx.assertTrue(expectedJsonString.contains("blue"));
    }

    @Test
    public void testTimeSlotsCreation(TestContext ctx) {
        JsonObject validJson = new JsonObject()
                .put(CAMEL_BEGIN_DATE, "2024-10-01")
                .put(CAMEL_END_DATE, "2024-10-10")
                .put(DURATION, "01:00")
                .put(PERIODICITY, Periodicity.WEEKLY.getValue())
                .put(CAMEL_DAILY_SLOTS, new JsonArray(Arrays.asList(
                    new JsonObject()
                        .put(DAY, "MONDAY")
                        .put(CAMEL_BEGIN_TIME, "09:00")
                        .put(CAMEL_END_TIME, "11:00")
                )));

        GridPayload gridPayload = new GridPayload(validJson);
        gridPayload.buildTimeSlots();
        String stringTimeSlots = gridPayload.getTimeSlots().stream().map(TimeSlotPayload::toString).collect(Collectors.joining(", "));
        String expectedJsonString =
                "{\"begin\":\"2024-10-07 09:00\",\"end\":\"2024-10-07 10:00\"}, " +
                "{\"begin\":\"2024-10-07 10:00\",\"end\":\"2024-10-07 11:00\"}";

        LogHelper.logInfo(this, "", stringTimeSlots);

        ctx.assertEquals(expectedJsonString, stringTimeSlots);
    }
}
