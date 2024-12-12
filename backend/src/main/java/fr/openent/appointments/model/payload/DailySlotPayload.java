package fr.openent.appointments.model.payload;

import fr.openent.appointments.enums.Day;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import java.time.LocalTime;

import static fr.openent.appointments.core.constants.Constants.CAMEL_BEGIN_TIME;
import static fr.openent.appointments.core.constants.Constants.CAMEL_END_TIME;
import static fr.openent.appointments.core.constants.Fields.*;

public class DailySlotPayload implements IModel<DailySlotPayload> {

    private Day day;
    private LocalTime beginTime;
    private LocalTime endTime;

    // Constructor

    public DailySlotPayload(JsonObject dailySlot) {
        this.day = Day.getDay(dailySlot.getString(DAY, null));
        this.beginTime = DateHelper.parseTime(dailySlot.getString(CAMEL_BEGIN_TIME, null));
        this.endTime = DateHelper.parseTime(dailySlot.getString(CAMEL_END_TIME, null));
    }

    // Getter

    public Day getDay() {
        return day;
    }

    public LocalTime getBeginTime() {
        return beginTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    // Setter

    public DailySlotPayload setDay(Day day) {
        this.day = day;
        return this;
    }

    public DailySlotPayload setBeginTime(LocalTime beginTime) {
        this.beginTime = beginTime;
        return this;
    }

    public DailySlotPayload setEndTime(LocalTime endTime) {
        this.endTime = endTime;
        return this;
    }

    // Functions

    public String toString() {
        return this.getClass().getSimpleName() +
                " {" +
                    "day=" + day +
                    ", beginTime=" + beginTime +
                    ", endTime=" + endTime +
                '}';
    }

    public boolean isValid() {
        return  this.day != null &&
                this.beginTime != null &&
                this.endTime != null &&
                this.beginTime.isBefore(this.endTime);
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
