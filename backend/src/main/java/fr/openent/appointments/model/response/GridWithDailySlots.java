package fr.openent.appointments.model.response;

import fr.openent.appointments.enums.Periodicity;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.DailySlot;
import fr.openent.appointments.model.database.Grid;
import fr.openent.appointments.model.database.NeoGroup;
import fr.openent.appointments.model.database.NeoStructure;
import io.vertx.core.json.JsonObject;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

public class GridWithDailySlots implements IModel<GridWithDailySlots> {

    private Long id;
    private String name;
    private String color;
    private LocalDate beginDate;
    private LocalDate endDate;
    private NeoStructure structure;
    private Duration duration;
    private Periodicity periodicity;
    private List<NeoGroup> groups;
    private String videoCallLink;
    private String place;
    private String documentId;
    private String publicComment;
    private List<DailySlot> dailySlots;
    private String ownerId;

    // Constructor
    public GridWithDailySlots(Grid grid, NeoStructure structure, List<NeoGroup> groups, List<DailySlot> dailySlots) {
        this.id = grid.getId();
        this.name = grid.getName();
        this.color = grid.getColor();
        this.beginDate = grid.getBeginDate();
        this.endDate = grid.getEndDate();
        this.structure = structure;
        this.duration = grid.getDuration();
        this.periodicity = grid.getPeriodicity();
        this.groups = groups;
        this.videoCallLink = grid.getVideoCallLink();
        this.place = grid.getPlace();
        this.documentId = grid.getDocumentId();
        this.publicComment = grid.getPublicComment();
        this.dailySlots = dailySlots;
        this.ownerId = grid.getOwnerId();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public NeoStructure getStructure() {
        return structure;
    }

    public Duration getDuration() {
        return duration;
    }

    public Periodicity getPeriodicity() {
        return periodicity;
    }

    public List<NeoGroup> getGroups() {
        return groups;
    }

    public String getVideoCallLink() {
        return videoCallLink;
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

    public List<DailySlot> getDailySlots() {
        return dailySlots;
    }

    public String getOwnerId() {
        return ownerId;
    }

    // Setters

    public GridWithDailySlots setId(Long id) {
        this.id = id;
        return this;
    }

    public GridWithDailySlots setName(String name) {
        this.name = name;
        return this;
    }

    public GridWithDailySlots setColor(String color) {
        this.color = color;
        return this;
    }

    public GridWithDailySlots setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public GridWithDailySlots setEndDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public GridWithDailySlots setStructure(NeoStructure structure) {
        this.structure = structure;
        return this;
    }

    public GridWithDailySlots setDuration(Duration duration) {
        this.duration = duration;
        return this;
    }

    public GridWithDailySlots setPeriodicity(Periodicity periodicity) {
        this.periodicity = periodicity;
        return this;
    }

    public GridWithDailySlots setGroups(List<NeoGroup> groups) {
        this.groups = groups;
        return this;
    }

    public GridWithDailySlots setVideoCallLink(String videoCallLink) {
        this.videoCallLink = videoCallLink;
        return this;
    }

    public GridWithDailySlots setPlace(String place) {
        this.place = place;
        return this;
    }

    public GridWithDailySlots setDocumentId(String documentId) {
        this.documentId = documentId;
        return this;
    }

    public GridWithDailySlots setPublicComment(String publicComment) {
        this.publicComment = publicComment;
        return this;
    }

    public GridWithDailySlots setDailySlots(List<DailySlot> dailySlots) {
        this.dailySlots = dailySlots;
        return this;
    }

    public GridWithDailySlots setOwnerId(String ownerId) {
        this.ownerId = ownerId;
        return this;
    }

    // Methods

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }

}
