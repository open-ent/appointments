package fr.openent.appointments.model.database;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.ID;
import static fr.openent.appointments.core.constants.Fields.NAME;

public class NeoGroup implements IModel<NeoGroup> {

    private String id;
    private String name;

    // Constructor

    public NeoGroup() {}

    public NeoGroup(JsonObject neoGroup) {
        this.setId(neoGroup.getString(ID, null));
        this.setName(neoGroup.getString(NAME, null));
    }

    // Getter

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    // Setter

    public NeoGroup setId(String id) {
        this.id = id;
        return this;
    }

    public NeoGroup setName(String name) {
        this.name = name;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, false);
    }
}
