package fr.openent.appointments.model.database;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.helper.UserFunctionHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.Fields.ID;

public class NeoUser implements IModel<NeoUser> {

    private String id;
    private String displayName;
    private List<String> functions;
    private String picture;
    private LocalDate lastAppointmentDate;
    private Boolean isAvailable;

    // Constructor

    public NeoUser(JsonObject neoUser) {
        this.setId(neoUser.getString(ID));
        this.setDisplayName(neoUser.getString(CAMEL_DISPLAY_NAME));
        this.setFunctions(neoUser.getJsonArray(FUNCTIONS));
        this.setPicture(neoUser.getString(PICTURE));
    }

    public NeoUser(JsonObject neoUser, LocalDate lastAppointmentDate, Boolean isAvailable) {
        this(neoUser);
        this.setLastAppointmentDate(lastAppointmentDate);
        this.setIsAvailable(isAvailable);

    }

    // Getter

    public String getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public List<String> getFunctions() {
        return functions;
    }

    public String getPicture() {
        return picture;
    }

    public LocalDate getLastAppointmentDate() {
        return lastAppointmentDate;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    // Setter

    public NeoUser setId(String id) {
        this.id = id;
        return this;
    }

    public NeoUser setDisplayName(String displayName) {
        this.displayName = displayName;
        return this;
    }

    public NeoUser setFunctions(JsonArray functions) {
        List<String> stringFunctions = functions.stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .collect(Collectors.toList());
        this.functions = UserFunctionHelper.format(stringFunctions);
        return this;
    }

    public NeoUser setPicture(String picture) {
        this.picture = picture;
        return this;
    }

    public NeoUser setLastAppointmentDate(LocalDate lastAppointmentDate) {
        this.lastAppointmentDate = lastAppointmentDate;
        return this;
    }

    public NeoUser setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, false);
    }
}
