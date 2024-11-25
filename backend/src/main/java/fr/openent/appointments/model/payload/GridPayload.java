package fr.openent.appointments.model.payload;

import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.List;

import fr.openent.appointments.enums.Day;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.Fields.*;

public class GridPayload implements IModel<GridPayload> {

    private String gridName;
    private LocalDate beginDate;
    private LocalDate endDate;
    private String color;
    private String structureId;
    private Duration duration;
    private Periodicity periodicity;
    private List<String> targetPublicIds;
    private List<DailySlotPayload> dailySlots;
    private List<TimeSlotPayload> timeSlots;
    private String visioLink;
    private String place;
    private String documentId;
    private String publicComment;

    public GridPayload(JsonObject grid) {
        this.gridName = grid.getString(NAME, null);
        this.beginDate = DateHelper.parseDate(grid.getString(CAMEL_BEGIN_DATE, null));
        this.endDate = DateHelper.parseDate(grid.getString(CAMEL_END_DATE, null));
        this.color = grid.getString(COLOR);
        this.structureId = grid.getString(CAMEL_STRUCTURE_ID,null);
        this.duration = DateHelper.parseDuration(grid.getString(DURATION,null));
        this.periodicity = Periodicity.getPeriodicity(grid.getInteger(PERIODICITY,0));
        this.targetPublicIds = grid
            .getJsonArray(CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray())
            .stream()
            .map(Object::toString)
            .collect(Collectors.toList());
        this.dailySlots = IModelHelper.toList(grid.getJsonArray(CAMEL_DAILY_SLOTS, new JsonArray()), DailySlotPayload.class);
        this.visioLink = grid.getString(CAMEL_VISIO_LINK, null);
        this.place = grid.getString(PLACE, null);
        this.documentId = grid.getString(CAMEL_DOCUMENT_ID, null);
        this.publicComment = grid.getString(CAMEL_PUBLIC_COMMENT, null);
    }

    // Getters

    public String getGridName() {
        return gridName;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getColor() {
        return color;
    }

    public String getStructureId() {
        return structureId;
    }

    public Duration getDuration() {
        return duration;
    }

    public Periodicity getPeriodicity() {
        return periodicity;
    }

    public List<String> getTargetPublicIds() {
        return targetPublicIds;
    }

    public List<DailySlotPayload> getDailySlots() {
        return dailySlots;
    }

    public List<TimeSlotPayload> getTimeSlots() {
        return timeSlots;
    }

    public String getVisioLink() {
        return visioLink;
    }

    public String getPlace() {
        return place;
    }

    public String getDocumentId() {
        return documentId;
    }

    public String getPublicComment() {
        return publicComment;
    }

    // Setters

    public GridPayload setGridName(String gridName) {
        this.gridName = gridName;
        return this;
    }

    public GridPayload setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public GridPayload setEndDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public GridPayload setColor(String color) {
        this.color = color;
        return this;
    }

    public GridPayload setStructureId(String structureId) {
        this.structureId = structureId;
        return this;
    }

    public GridPayload setDuration(Duration duration) {
        this.duration = duration;
        return this;
    }

    public GridPayload setPeriodicity(Periodicity periodicity) {
        this.periodicity = periodicity;
        return this;
    }

    public GridPayload setTargetPublicIds(List<String> targetPublicIds) {
        this.targetPublicIds = targetPublicIds;
        return this;
    }

    public GridPayload setDailySlots(List<DailySlotPayload> dailySlots) {
        this.dailySlots = dailySlots;
        return this;
    }

    public GridPayload setTimeSlots(List<TimeSlotPayload> timeSlots) {
        this.timeSlots = timeSlots;
        return this;
    }

    public GridPayload setVisioLink(String visioLink) {
        this.visioLink = visioLink;
        return this;
    }

    public GridPayload setPlace(String place) {
        this.place = place;
        return this;
    }

    public GridPayload setDocumentId(String documentId) {
        this.documentId = documentId;
        return this;
    }

    public GridPayload setPublicComment(String publicComment) {
        this.publicComment = publicComment;
        return this;
    }

    // Functions

    public boolean isValid() {
        return !this.gridName.isEmpty() &&
                this.beginDate != null &&
                this.endDate != null &&
                this.beginDate.isBefore(this.endDate) &&
                !this.color.isEmpty() &&
                !this.structureId.isEmpty() &&
                this.duration != null &&
                this.duration != Duration.ZERO &&
                this.duration.compareTo(Duration.ofDays(1)) < 0 &&
                this.periodicity != null &&
                !this.targetPublicIds.isEmpty() &&
                !this.dailySlots.isEmpty() && this.dailySlots.stream().allMatch(DailySlotPayload::isValid);
    }

    public void buildTimeSlots() {
        this.timeSlots = new ArrayList<>();
        LocalDate currentMonday = this.beginDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        List<Day> days = this.dailySlots.stream()
                .map(DailySlotPayload::getDay)
                .distinct()
                .sorted(Comparator.comparingInt(Enum::ordinal))
                .collect(Collectors.toList());

        // We run through the weeks (by 1 or 2)
        while (!currentMonday.isAfter(this.endDate)) {

            // We run through the wanted days of the current week and ignore the other days
            for (Day day : days) {
                LocalDate currentDate  = currentMonday.with(TemporalAdjusters.nextOrSame(DayOfWeek.valueOf(day.getValue())));
                if (currentDate.isBefore(this.beginDate) || currentDate.isAfter(this.endDate)) continue;

                List<DailySlotPayload> currentDayDailySlots = this.dailySlots.stream()
                        .filter(dailySlot -> dailySlot.getDay() == day)
                        .collect(Collectors.toList());

                // We run through the dailySlot existing in this day
                for (DailySlotPayload dailySlot : currentDayDailySlots) {
                    LocalTime currentTime = dailySlot.getBeginTime();
                    LocalTime endTime = dailySlot.getEndTime();

                    // We calculate the timeSlots dividing the current dailySlot
                    while (!currentTime.plus(this.duration).isAfter(endTime)) { // We checked if there is still room for another timeslot
                        LocalDateTime begin = currentDate.atTime(currentTime);
                        LocalDateTime end = currentDate.atTime(currentTime).plus(this.duration);
                        this.timeSlots.add(new TimeSlotPayload(begin, end));

                        currentTime = currentTime.plus(this.duration);
                    }
                }
            }

            currentMonday = currentMonday.plusWeeks(this.periodicity.getValue());
        }
    }

    public String toString() {
        return new JsonObject()
            .put(NAME, this.gridName)
            .put(CAMEL_BEGIN_DATE, DateHelper.formatDate(this.beginDate))
            .put(CAMEL_END_DATE, DateHelper.formatDate(this.endDate))
            .put(COLOR, this.color)
            .put(CAMEL_STRUCTURE_ID, this.structureId)
            .put(DURATION, DateHelper.formatDuration(this.duration))
            .put(PERIODICITY, this.periodicity.getValue())
            .put(CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(this.targetPublicIds))
            .put(CAMEL_DAILY_SLOTS, new JsonArray(this.dailySlots.stream().map(DailySlotPayload::toString).collect(Collectors.toList())))
            .put(CAMEL_TIME_SLOTS, new JsonArray(this.timeSlots.stream().map(TimeSlotPayload::toString).collect(Collectors.toList())))
            .put(CAMEL_VISIO_LINK, this.visioLink)
            .put(PLACE, this.place)
            .put(CAMEL_DOCUMENT_ID, this.documentId)
            .put(CAMEL_PUBLIC_COMMENT, this.publicComment)
            .toString();
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, true);
    }
}
