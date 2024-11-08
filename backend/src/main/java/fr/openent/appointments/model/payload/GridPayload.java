package fr.openent.appointments.model.payload;

import java.util.stream.Collectors;
import java.util.List;
import java.time.LocalDate;
import java.time.Duration;

import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.DailySlot;
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
    private List<DailySlot> dailySlots;
    private String visioLink;
    private String place;
    private String documentId;
    private String publicComment;

    public GridPayload(JsonObject grid){
        this.gridName = grid.getString(NAME, "");

        this.beginDate = DateHelper.parseDate(grid.getString(CAMEL_BEGIN_DATE, ""));
        this.endDate = DateHelper.parseDate(grid.getString(CAMEL_END_DATE, ""));

        this.color = grid.getString(COLOR);
        this.structureId = grid.getString(CAMEL_STRUCTURE_ID,"");

        this.duration = DateHelper.parseDuration(grid.getString(DURATION,""));

        this.periodicity = Periodicity.getPeriodicity(grid.getInteger(PERIODICITY,0));

        this.targetPublicIds = grid
            .getJsonArray(CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray())
            .stream()
            .map(Object::toString)
            .collect(Collectors.toList());

        this.dailySlots = IModelHelper.toList(grid.getJsonArray(CAMEL_DAILY_SLOTS, new JsonArray()), DailySlot.class);

        this.visioLink = grid.getString(CAMEL_VISIO_LINK, "");
        this.place = grid.getString(PLACE, "");
        this.documentId = grid.getString(CAMEL_DOCUMENT_ID, "");
        this.publicComment = grid.getString(CAMEL_PUBLIC_COMMENT, "");
    }

    public boolean isValid() {
        return !this.gridName.isEmpty() &&
                this.beginDate != null &&
                this.endDate != null &&
                this.beginDate.isBefore(this.endDate) &&
                !this.color.isEmpty() &&
                !this.structureId.isEmpty() &&
                this.duration != null &&
                this.periodicity != null &&
                !this.targetPublicIds.isEmpty() &&
                !this.dailySlots.isEmpty() &&
                this.dailySlots.stream().allMatch(DailySlot::isValid);
    }

    // getters
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

    public List<DailySlot> getDailySlots() {
        return dailySlots;
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

    // setters

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

    public GridPayload setDailySlots(List<DailySlot> dailySlots) {
        this.dailySlots = dailySlots;
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
            .put(CAMEL_DAILY_SLOTS, new JsonArray(this.dailySlots.stream().map(DailySlot::toString).collect(Collectors.toList())))
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
