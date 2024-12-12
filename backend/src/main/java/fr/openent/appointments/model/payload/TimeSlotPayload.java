package fr.openent.appointments.model.payload;

import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import java.time.LocalDateTime;

import static fr.openent.appointments.core.constants.Constants.CAMEL_BEGIN_DATE;
import static fr.openent.appointments.core.constants.Constants.CAMEL_END_DATE;
import static fr.openent.appointments.core.constants.Fields.*;

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
        return new JsonObject()
                .put(BEGIN, DateHelper.formatDateTime(this.begin))
                .put(END, DateHelper.formatDateTime(this.end))
                .toString();
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
