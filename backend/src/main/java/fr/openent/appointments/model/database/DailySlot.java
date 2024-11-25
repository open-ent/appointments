package fr.openent.appointments.model.database;

import fr.openent.appointments.enums.Day;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;

import java.time.LocalTime;

import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.*;

public class DailySlot implements IModel<DailySlot> {

    private Long id;
    private Long gridId;
    private Day day;
    private LocalTime beginTime;
    private LocalTime endTime;

    // Constructor

    public DailySlot(JsonObject dailySlot) {
        this.id = dailySlot.getLong(ID, null);
        this.gridId = dailySlot.getLong(GRID_ID, null);
        this.day = Day.getDay(dailySlot.getString(DAY, null));
        this.beginTime = DateHelper.parseTime(dailySlot.getString(BEGIN_TIME, null));
        this.endTime = DateHelper.parseTime(dailySlot.getString(END_TIME, null));
    }

    // Getter

    public Long getId() {
        return id;
    }

    public Long getGridId() {
        return gridId;
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

    // Setter

    public DailySlot setId(Long id) {
        this.id = id;
        return this;
    }

    public DailySlot setGridId(Long gridId) {
        this.gridId = gridId;
        return this;
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

    // Functions

    public String toString() {
        return "DailySlot{" +
                "id=" + id +
                ", gridId=" + gridId +
                ", day=" + day +
                ", beginTime=" + beginTime +
                ", endTime=" + endTime +
                '}';
    }

    public boolean isValid() {
        return  this.gridId != null &&
                this.day != null &&
                this.beginTime != null &&
                this.endTime != null &&
                this.beginTime.isBefore(this.endTime);
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, false);
    }
}
