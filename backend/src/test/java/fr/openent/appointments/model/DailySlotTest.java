package fr.openent.appointments.model;

import fr.openent.appointments.enums.Day;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.time.LocalTime;

import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.Constants.*;

@RunWith(VertxUnitRunner.class)
public class DailySlotTest {

    // Valid JSON objects for testing
    JsonObject validDailySlotJson = new JsonObject()
            .put(DAY, "MONDAY")
            .put(CAMEL_BEGIN_TIME, "09:00")
            .put(CAMEL_END_TIME, "17:00");

    JsonObject invalidDailySlotJson = new JsonObject()
            .put(DAY, "MONDAY")
            .put(CAMEL_BEGIN_TIME, "18:00")  // Invalid: end time is before start time
            .put(CAMEL_END_TIME, "09:00");

    JsonObject missingFieldDailySlotJson = new JsonObject()
            .put(DAY, "WEDNESDAY");

    JsonObject sameBeginAndEndTimeJson = new JsonObject()
            .put(DAY, "FRIDAY")
            .put(CAMEL_BEGIN_TIME, "12:00")
            .put(CAMEL_END_TIME, "12:00"); // Edge case: begin and end time are the same

    @Test
    public void testDailySlotHasBeenInstantiated(TestContext ctx) {
        // Test with a valid DailySlot
        DailySlot validSlot = new DailySlot(validDailySlotJson);
        ctx.assertEquals(Day.MONDAY, validSlot.getDay());
        ctx.assertEquals(LocalTime.of(9, 0), validSlot.getBeginTime());
        ctx.assertEquals(LocalTime.of(17, 0), validSlot.getEndTime());
        ctx.assertTrue(validSlot.isValid());

        // Test with an invalid DailySlot
        DailySlot invalidSlot = new DailySlot(invalidDailySlotJson);
        ctx.assertEquals(Day.MONDAY, invalidSlot.getDay());
        ctx.assertEquals(LocalTime.of(18, 0), invalidSlot.getBeginTime());
        ctx.assertEquals(LocalTime.of(9, 0), invalidSlot.getEndTime());
        ctx.assertFalse(invalidSlot.isValid());

        // Test with a DailySlot missing fields
        DailySlot missingFieldSlot = new DailySlot(missingFieldDailySlotJson);
        ctx.assertEquals(Day.WEDNESDAY, missingFieldSlot.getDay());
        ctx.assertNull(missingFieldSlot.getBeginTime());
        ctx.assertNull(missingFieldSlot.getEndTime());
        ctx.assertFalse(missingFieldSlot.isValid());
    }

    @Test
    public void testDailySlotHasContentWithObject(TestContext ctx) {
        DailySlot slot = new DailySlot(validDailySlotJson);
        boolean isNotEmpty =
                slot.getDay() != null &&
                slot.getBeginTime() != null &&
                slot.getEndTime() != null;
        ctx.assertTrue(isNotEmpty);
    }

    @Test
    public void testSameBeginAndEndTime(TestContext ctx) {
        DailySlot slot = new DailySlot(sameBeginAndEndTimeJson);
        ctx.assertEquals(Day.FRIDAY, slot.getDay());
        ctx.assertEquals(LocalTime.of(12, 0), slot.getBeginTime());
        ctx.assertEquals(LocalTime.of(12, 0), slot.getEndTime());
        ctx.assertFalse(slot.isValid()); // Assuming isValid() returns false for the same time
    }

    @Test
    public void testValidSlotCreation(TestContext ctx) {
        DailySlot slot = new DailySlot(validDailySlotJson);
        ctx.assertTrue(slot.isValid()); // Ensure valid slot is valid
    }

    @Test
    public void testInvalidTimeOrder(TestContext ctx) {
        DailySlot slot = new DailySlot(invalidDailySlotJson);
        ctx.assertFalse(slot.isValid()); // Ensure invalid slot is not valid
    }

    @Test
    public void testMissingRequiredFields(TestContext ctx) {
        DailySlot slot = new DailySlot(missingFieldDailySlotJson);
        ctx.assertFalse(slot.isValid()); // Ensure slot with missing fields is not valid
    }
}
