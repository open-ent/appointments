package fr.openent.appointments.model.payload;

import java.util.stream.Collectors;
import java.util.List;
import java.time.LocalDate;
import java.time.Duration;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.DailySlot;
import fr.openent.appointments.model.IModel;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

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
        this.gridName = grid.getString(Fields.NAME, "");

        this.beginDate = DateHelper.parseDate(grid.getString(Fields.CAMEL_BEGIN_DATE, ""));
        this.endDate = DateHelper.parseDate(grid.getString(Fields.CAMEL_END_DATE, ""));

        this.color = grid.getString(Fields.COLOR);
        this.structureId = grid.getString(Fields.CAMEL_STRUCTURE_ID,"");

        this.duration = DateHelper.parseDuration(grid.getString(Fields.DURATION,""));

        this.periodicity = Periodicity.getPeriodicity(grid.getInteger(Fields.PERIODICITY,0));

        this.targetPublicIds = grid
            .getJsonArray(Fields.CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray())
            .stream()
            .map(Object::toString)
            .collect(Collectors.toList());

        this.dailySlots = IModelHelper.toList(grid.getJsonArray(Fields.CAMEL_DAILY_SLOTS, new JsonArray()), DailySlot.class);

        this.visioLink = grid.getString(Fields.CAMEL_VISIO_LINK);
        this.place = grid.getString(Fields.PLACE);
        this.documentId = grid.getString(Fields.CAMEL_DOCUMENT_ID);
        this.publicComment = grid.getString(Fields.CAMEL_PUBLIC_COMMENT);
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
            .put(Fields.NAME, this.gridName)
            .put(Fields.CAMEL_BEGIN_DATE, DateHelper.formatDate(this.beginDate))
            .put(Fields.CAMEL_END_DATE, DateHelper.formatDate(this.endDate))
            .put(Fields.COLOR, this.color)
            .put(Fields.CAMEL_STRUCTURE_ID, this.structureId)
            .put(Fields.DURATION, DateHelper.formatDuration(this.duration))
            .put(Fields.PERIODICITY, this.periodicity.getValue())
            .put(Fields.CAMEL_TARGET_PUBLIC_LIST_ID, new JsonArray(this.targetPublicIds))
            .put(Fields.CAMEL_DAILY_SLOTS, new JsonArray(this.dailySlots.stream().map(DailySlot::toString).collect(Collectors.toList())))
            .put(Fields.CAMEL_VISIO_LINK, this.visioLink)
            .put(Fields.PLACE, this.place)
            .put(Fields.CAMEL_DOCUMENT_ID, this.documentId)
            .put(Fields.CAMEL_PUBLIC_COMMENT, this.publicComment)
            .toString();
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, true);
    }
}
