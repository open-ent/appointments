package fr.openent.appointments.model.database;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

public class NeoGroup extends BaseNeoEntity implements IModel<NeoGroup> {

    public NeoGroup(JsonObject neoEntity) {
        super(neoEntity);
    }

    public NeoGroup(String id, String name) {
        super(id, name);
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
