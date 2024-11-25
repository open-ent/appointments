package fr.openent.appointments.model.payload;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import java.time.LocalDateTime;

public class TimeSlotPayload implements IModel<TimeSlotPayload> {

    private LocalDateTime begin;
    private LocalDateTime end;

    // Constructor

    public TimeSlotPayload(LocalDateTime begin, LocalDateTime end) {
        this.begin = begin;
        this.end = end;
    }

    // Getter

    public LocalDateTime getBegin() {
        return begin;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    // Setter

    public TimeSlotPayload setBegin(LocalDateTime begin) {
        this.begin = begin;
        return this;
    }

    public TimeSlotPayload setEnd(LocalDateTime end) {
        this.end = end;
        return this;
    }

    // Functions

    public String toString() {
        return this.getClass().getSimpleName() +
                " {" +
                    "begin=" + begin +
                    ", end=" + end +
                '}';
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, false);
    }
}
