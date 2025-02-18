package fr.openent.appointments.model.database;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.time.LocalDate;
import java.time.Duration;
import java.util.stream.Collectors;

import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;

import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.*;

public class Grid implements IModel<Grid> {

    private Long id;
    private String name;
    private String ownerId;
    private String structureId;
    private LocalDate beginDate;
    private LocalDate endDate;
    private LocalDate creationDate;
    private LocalDate updatingDate;
    private String color;
    private Duration duration;
    private Periodicity periodicity;
    private List<String> targetPublicListId;
    private String videoCallLink;
    private String place;
    private List<String> documentsIds;
    private String publicComment;
    private GridState state;

    // Constructor

    public Grid(JsonObject grid) {
        this.id = grid.getLong(ID, null);
        this.name = grid.getString(NAME, null);
        this.ownerId = grid.getString(OWNER_ID, null);
        this.structureId = grid.getString(STRUCTURE_ID, null);
        this.beginDate = DateHelper.parseDate(grid.getString(BEGIN_DATE, null).substring(0, 10));
        this.endDate = DateHelper.parseDate(grid.getString(END_DATE, null).substring(0, 10));
        this.creationDate = DateHelper.parseDate(grid.getString(CREATION_DATE, null).substring(0, 10));
        this.updatingDate = DateHelper.parseDate(grid.getString(UPDATING_DATE, null).substring(0,10));
        this.color = grid.getString(COLOR, null);
        this.duration = DateHelper.parseDuration(grid.getString(DURATION,null));
        this.periodicity = Periodicity.getPeriodicity(grid.getInteger(PERIODICITY,0));
        this.videoCallLink = grid.getString(VIDEO_CALL_LINK, null);
        this.place = grid.getString(PLACE, null);
        this.publicComment = grid.getString(PUBLIC_COMMENT, null);
        this.state = GridState.getGridState(grid.getString(STATE, null));

        String stringTargetPublicListId = grid.getString(TARGET_PUBLIC_LIST_ID, "");
        String cleanedTargetPublicListId = stringTargetPublicListId.substring(1, stringTargetPublicListId.length() - 1);
        this.targetPublicListId = Arrays.asList(cleanedTargetPublicListId.split(",\\s*"));

        String stringDocumentsIds = grid.getString(DOCUMENTS_IDS, "");

        if (stringDocumentsIds.length() > 2) {
            String cleanedDocumentsIds = stringDocumentsIds.substring(1, stringDocumentsIds.length() - 1);
            this.documentsIds = Arrays.asList(cleanedDocumentsIds.split(",\\s*"));
        } else {
            this.documentsIds = new ArrayList<>();
        }
    }

    // Getter

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public String getStructureId() {
        return structureId;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public LocalDate getUpdatingDate() {
        return updatingDate;
    }

    public String getColor() {
        return color;
    }

    public Duration getDuration() {
        return duration;
    }

    public Periodicity getPeriodicity() {
        return periodicity;
    }

    public List<String> getTargetPublicListId() {
        return targetPublicListId;
    }

    public String getVideoCallLink() {
        return videoCallLink;
    }

    public String getPlace() {
        return place;
    }

    public List<String> getDocumentsIds() {
        return documentsIds;
    }

    public String getPublicComment() {
        return publicComment;
    }

    public GridState getState() {
        return state;
    }

    // Setter

    public Grid setId(Long id) {
        this.id = id;
        return this;
    }

    public Grid setName(String name) {
        this.name = name;
        return this;
    }

    public Grid setOwnerId(String ownerId) {
        this.ownerId = ownerId;
        return this;
    }

    public Grid setStructureId(String structureId) {
        this.structureId = structureId;
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

    public Grid setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public Grid setUpdatingDate(LocalDate updatingDate) {
        this.updatingDate = updatingDate;
        return this;
    }

    public Grid setColor(String color) {
        this.color = color;
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

    public Grid setTargetPublicListId(List<String> targetPublicListId) {
        this.targetPublicListId = targetPublicListId;
        return this;
    }

    public Grid setVideoCallLink(String videoCallLink) {
        this.videoCallLink = videoCallLink;
        return this;
    }

    public Grid setPlace(String place) {
        this.place = place;
        return this;
    }

    public Grid setDocumentsIds(List<String> documentsIds) {
        this.documentsIds = documentsIds;
        return this;
    }

    public Grid setPublicComment(String publicComment) {
        this.publicComment = publicComment;
        return this;
    }

    public Grid setState(GridState state) {
        this.state = state;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
