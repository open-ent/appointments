package fr.openent.appointments.model;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.database.NeoUser;
import io.vertx.core.json.JsonObject;

import java.time.LocalDate;
import java.util.List;

public class UserAppointment implements IModel<UserAppointment> {

    private String userId;
    private String displayName;
    private String picture;
    private List<String> functions;
    private LocalDate lastAppointmentDate;
    private Boolean isAvailable;

    // Constructor

    public UserAppointment(NeoUser user, LocalDate lastAppointmentDate, Boolean availability) {
        this.setUserId(user.getId());
        this.setDisplayName(user.getDisplayName());
        this.setPicture(user.getPicture());
        this.setFunctions(user.getFunctions());
        this.setLastAppointmentDate(lastAppointmentDate);
        this.setIsAvailable(availability);
    }

    // Getter

    public String getUserId() {
        return userId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getPicture() {
        return picture;
    }

    public List<String> getFunctions() {
        return functions;
    }

    public LocalDate getLastAppointmentDate() {
        return lastAppointmentDate;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    // Setter

    public UserAppointment setUserId(String userId) {
        this.userId = userId;
        return this;
    }

    public UserAppointment setDisplayName(String displayName) {
        this.displayName = displayName;
        return this;
    }

    public UserAppointment setPicture(String picture) {
        this.picture = picture;
        return this;
    }

    public UserAppointment setFunctions(List<String> functions) {
        this.functions = functions;
        return this;
    }

    public UserAppointment setLastAppointmentDate(LocalDate lastAppointmentDate) {
        this.lastAppointmentDate = lastAppointmentDate;
        return this;
    }

    public UserAppointment setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, false);
    }
}
