package fr.openent.appointments.model.bdd;

import java.util.stream.Collectors;
import java.util.List;
import java.time.LocalDate;
import java.time.Duration;

import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

public class Grid implements IModel<Grid> {

    private String gridName;
    private LocalDate beginDate;
    private LocalDate endDate;
    private String color;
    private String structureId;
    private Duration duration;
    private Periodicity periodicity;
    private List<String> targetPublicIds;
    private String visioLink;
    private String place;
    private String documentId;
    private String publicComment;

    public Grid(JsonObject grid) {
        this.gridName = grid.getString(Fields.NAME, "");

        this.beginDate = DateHelper.parseDate(grid.getString(Fields.BEGIN_DATE, ""));
        this.endDate = DateHelper.parseDate(grid.getString(Fields.END_DATE, ""));

        this.color = grid.getString(Fields.COLOR);
        this.structureId = grid.getString(Fields.STRUCTURE_ID,"");

        this.duration = DateHelper.parseDuration(grid.getString(Fields.DURATION,""));

        this.periodicity = Periodicity.getPeriodicity(grid.getInteger(Fields.PERIODICITY,0));

        this.targetPublicIds = grid
            .getJsonArray(Fields.TARGET_PUBLIC_LIST_ID, new JsonArray())
            .stream()
            .map(Object::toString)
            .collect(Collectors.toList());

        this.visioLink = grid.getString(Fields.VISIO_LINK);
        this.place = grid.getString(Fields.PLACE);
        this.documentId = grid.getString(Fields.DOCUMENT_ID);
        this.publicComment = grid.getString(Fields.PUBLIC_COMMENT);
    }

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

    public Grid setGridName(String gridName) {
        this.gridName = gridName;
        return this;
    }

    public Grid setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public Grid setEndDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public Grid setColor(String color) {
        this.color = color;
        return this;
    }

    public Grid setStructureId(String structureId) {
        this.structureId = structureId;
        return this;
    }

    public Grid setDuration(Duration duration) {
        this.duration = duration;
        return this;
    }

    public Grid setPeriodicity(Periodicity periodicity) {
        this.periodicity = periodicity;
        return this;
    }

    public Grid setTargetPublicIds(List<String> targetPublicIds) {
        this.targetPublicIds = targetPublicIds;
        return this;
    }

    public Grid setVisioLink(String visioLink) {
        this.visioLink = visioLink;
        return this;
    }

    public Grid setPlace(String place) {
        this.place = place;
        return this;
    }

    public Grid setDocumentId(String documentId) {
        this.documentId = documentId;
        return this;
    }

    public Grid setPublicComment(String publicComment) {
        this.publicComment = publicComment;
        return this;
    } 

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, true);
    }
}
