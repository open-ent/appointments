package fr.openent.appointments.model.database;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

public class NeoStructure extends BaseNeoEntity implements IModel<NeoStructure> {

    public NeoStructure(JsonObject neoEntity) {
        super(neoEntity);
    }

    public NeoStructure(String id, String name) {
        super(id, name);
    }

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
