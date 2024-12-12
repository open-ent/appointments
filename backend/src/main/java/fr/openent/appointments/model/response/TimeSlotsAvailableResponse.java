package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.TimeSlot;
import io.vertx.core.json.JsonObject;

import java.util.List;

public class TimeSlotsAvailableResponse implements IModel<TimeSlotsAvailableResponse> {

    private List<TimeSlot> timeslots;
    private TimeSlot nextAvailableTimeSlot;

    // Constructor

    public TimeSlotsAvailableResponse() {
        setTimeslots(null);
        setNextAvailableTimeSlot(null);
    }

    public TimeSlotsAvailableResponse(List<TimeSlot> timeslots) {
        setTimeslots(timeslots);
        setNextAvailableTimeSlot(null);
    }

    public TimeSlotsAvailableResponse(TimeSlot nextAvailableTimeSlot) {
        setTimeslots(null);
        setNextAvailableTimeSlot(nextAvailableTimeSlot);
    }

    public TimeSlotsAvailableResponse(List<TimeSlot> timeslots, TimeSlot nextAvailableTimeSlot) {
        setTimeslots(timeslots);
        setNextAvailableTimeSlot(nextAvailableTimeSlot);
    }

    // Getter

    public List<TimeSlot> getTimeslots() {
        return timeslots;
    }

    public TimeSlot getNextAvailableTimeSlot() {
        return nextAvailableTimeSlot;
    }

    // Setter

    public TimeSlotsAvailableResponse setTimeslots(List<TimeSlot> timeslots) {
        this.timeslots = timeslots;
        return this;
    }

    public TimeSlotsAvailableResponse setNextAvailableTimeSlot(TimeSlot nextAvailableTimeSlot) {
        this.nextAvailableTimeSlot = nextAvailableTimeSlot;
        return this;
    }


    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
