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
    private LocalDateTime begin;
    private LocalDateTime end;

    // Constructor

    public TimeSlot(JsonObject timeslot) {
        this.id = timeslot.getLong(ID, null);
        this.gridId = timeslot.getLong(GRID_ID, null);
        this.begin = DateHelper.parseDateTime(timeslot.getString(BEGIN, null));
        this.end = DateHelper.parseDateTime(timeslot.getString(END, null));
    }

    public TimeSlot(LocalDateTime begin, LocalDateTime end) {
        this.begin = begin;
        this.end = end;
    }

    // Getter

    public Long getId() {
        return id;
    }

    public Long getGridId() {
        return gridId;
    }

    public LocalDateTime getBegin() {
        return begin;
    }

    public LocalDateTime getEnd() {
        return end;
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

    public TimeSlot setBegin(LocalDateTime begin) {
        this.begin = begin;
        return this;
    }

    public TimeSlot setEnd(LocalDateTime end) {
        this.end = end;
        return this;
    }

    // Functions

    public String toString() {
        return "TimeSlot{" +
                "id=" + id +
                ", gridId=" + gridId +
                ", begin=" + begin +
                ", end=" + end +
                '}';
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, false);
    }
}
