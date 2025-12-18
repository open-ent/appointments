package fr.openent.appointments.model.database;

import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import java.time.LocalDateTime;

import static fr.openent.appointments.core.constants.Fields.*;

public class TimeSlot implements IModel<TimeSlot> {

    private Long id;
    private Long gridId;
    private LocalDateTime beginDate;
    private LocalDateTime endDate;
    private LocalDateTime deletedAt;

    // Constructor

    public TimeSlot(JsonObject timeslot) {
        this.id = timeslot.getLong(ID, null);
        this.gridId = timeslot.getLong(GRID_ID, null);
        this.beginDate = DateHelper.parseDateTime(timeslot.getString(BEGIN_DATE, null));
        this.endDate = DateHelper.parseDateTime(timeslot.getString(END_DATE, null));
        this.deletedAt = DateHelper.parseDateTime(timeslot.getString(DELETED_AT, null));
    }

    public TimeSlot(LocalDateTime begin, LocalDateTime end) {
        this.beginDate = begin;
        this.endDate = end;
    }

    // Getter

    public Long getId() {
        return id;
    }

    public Long getGridId() {
        return gridId;
    }

    public LocalDateTime getBeginDate() {
        return beginDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    // Setter

    public TimeSlot setId(Long id) {
        this.id = id;
        return this;
    }

    public TimeSlot setGridId(Long gridId) {
        this.gridId = gridId;
        return this;
    }

    public TimeSlot setBeginDate(LocalDateTime beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public TimeSlot setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
        return this;
    }

    public TimeSlot setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
        return this;
    }

    // Functions

    public String toString() {
        return "TimeSlot{" +
                "id=" + id +
                ", gridId=" + gridId +
                ", beginDate=" + beginDate +
                ", endDate=" + endDate +
                ", deletedAt=" + deletedAt +
                '}';
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
