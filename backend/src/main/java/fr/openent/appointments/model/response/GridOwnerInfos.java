package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.NeoUser;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Constants.CAMEL_OWNER_ID;
import static fr.openent.appointments.core.constants.Constants.CAMEL_OWNER_NAME;


public class GridOwnerInfos implements IModel<GridOwnerInfos> {
    private String ownerId;
    private String ownerName;

    // Constructor

    public GridOwnerInfos(JsonObject ownerInfos) {
        setOwnerId(ownerInfos.getString(CAMEL_OWNER_ID));
        setOwnerName(ownerInfos.getString(CAMEL_OWNER_NAME));
    }

    public GridOwnerInfos(NeoUser neoUser) {
        setOwnerId(neoUser.getId());
        setOwnerName(neoUser.getDisplayName());
    }

    // Getters

    public String getOwnerId() {
        return ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    // Setters

    public GridOwnerInfos setOwnerId(String ownerId) {
        this.ownerId = ownerId;
        return this;
    }

    public GridOwnerInfos setOwnerName(String ownerName) {
        this.ownerName = ownerName;
        return this;
    }


    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
