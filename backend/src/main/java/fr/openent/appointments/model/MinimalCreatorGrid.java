package fr.openent.appointments.model;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;

public class MinimalCreatorGrid extends MinimalGrid implements IModel<MinimalCreatorGrid> {

    // Constructor

    public MinimalCreatorGrid(JsonObject grid) {
        super(grid);
    }

    public MinimalCreatorGrid(Grid grid) {
        super(grid);
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, true);
    }
}
