package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import java.util.List;

public class ListAppointmentsResponse implements IModel<ListAppointmentsResponse> {
    private Long total;
    private List<MinimalAppointment> appointments;

    // Constructor

    public ListAppointmentsResponse(Long total, List<MinimalAppointment> appointments) {
        this.total = total;
        this.appointments = appointments;
    }

    // Getters

    public Long getTotal() {
        return total;
    }

    public List<MinimalAppointment> getAppointments() {
        return appointments;
    }


    // Setters

    public ListAppointmentsResponse setTotal(Long total) {
        this.total = total;
        return this;
    }

    public ListAppointmentsResponse setAppointments(List<MinimalAppointment> appointments) {
        this.appointments = appointments;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }

}
