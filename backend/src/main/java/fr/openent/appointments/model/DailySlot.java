package fr.openent.appointments.model;

import fr.openent.appointments.enums.Day;
import fr.openent.appointments.core.constants.Fields;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;

import java.time.LocalTime;
import io.vertx.core.json.JsonObject;

public class DailySlot implements IModel<DailySlot> {

    private Day day;
    private LocalTime beginTime;
    private LocalTime endTime;

    public DailySlot(JsonObject dailySlot){
        this.day = Day.getDay(dailySlot.getString(Fields.DAY, ""));
        this.beginTime = DateHelper.parseTime(dailySlot.getString(Fields.CAMEL_BEGIN_TIME, ""));
        this.endTime = DateHelper.parseTime(dailySlot.getString(Fields.CAMEL_END_TIME, ""));
    }

    public boolean isValid() {
        return  this.day != null && 
                this.beginTime != null && 
                this.endTime != null &&
                this.beginTime.isBefore(this.endTime);
    }

    public Day getDay() {
        return day;
    }

    public LocalTime getBeginTime() {
        return beginTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public DailySlot setDay(Day day) {
        this.day = day;
        return this;
    }

    public DailySlot setBeginTime(LocalTime beginTime) {
        this.beginTime = beginTime;
        return this;
    }

    public DailySlot setEndTime(LocalTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public String toString() {
        return "DailySlot{" +
                "day=" + day +
                ", beginTime=" + beginTime +
                ", endTime=" + endTime +
                '}';
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, true);
    }
}
