package fr.openent.appointments.model.database;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.*;

public class Appointment implements IModel<Appointment> {

    private Long id;
    private Long timeSlotId;
    private String requesterId;
    private AppointmentState state;

    // Constructor

    public Appointment(JsonObject appointment) {
        this.id = appointment.getLong(ID, null);
        this.timeSlotId = appointment.getLong(TIME_SLOT_ID, null);
        this.requesterId = appointment.getString(GRID_ID, null);
        this.state = AppointmentState.getAppointmentState(appointment.getString(STATE, null));
    }

    // Getter

    public Long getId() {
        return id;
    }

    public Long getTimeSlotId() {
        return timeSlotId;
    }

    public String getRequesterId() {
        return requesterId;
    }

    public AppointmentState getState() {
        return state;
    }

    // Setter

    public Appointment setId(Long id) {
        this.id = id;
        return this;
    }

    public Appointment setTimeSlotId(Long timeSlotId) {
        this.timeSlotId = timeSlotId;
        return this;
    }

    public Appointment setRequesterId(String requesterId) {
        this.requesterId = requesterId;
        return this;
    }

    public Appointment setState(AppointmentState state) {
        this.state = state;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
