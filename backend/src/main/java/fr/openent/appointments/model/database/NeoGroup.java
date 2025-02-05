package fr.openent.appointments.model.database;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.ID;
import static fr.openent.appointments.core.constants.Fields.NAME;

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
