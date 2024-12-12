package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;


public class MinimalGrid extends BaseMinimalGrid implements IModel<MinimalGrid> {

    // Constructor

    public MinimalGrid(JsonObject grid) {
        super(grid);
    }

    public MinimalGrid(Grid grid) {
        super(grid);
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
