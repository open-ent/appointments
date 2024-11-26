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

    // Constructor

    public NeoUser(JsonObject neoUser) {
        this.setId(neoUser.getString(ID, null));
        this.setDisplayName(neoUser.getString(CAMEL_DISPLAY_NAME, null));
        this.setFunctions(neoUser.getJsonArray(FUNCTIONS, new JsonArray()));
        this.setPicture(neoUser.getString(PICTURE, null));
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

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, false);
    }
}
