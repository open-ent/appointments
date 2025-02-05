package fr.openent.appointments.model.database;

import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.ID;
import static fr.openent.appointments.core.constants.Fields.NAME;

public abstract class BaseNeoEntity {
    private String id;
    private String name;

    public BaseNeoEntity(JsonObject neoEntity) {
        this.id = neoEntity.getString(ID, null);
        this.name = neoEntity.getString(NAME, null);
    }

    public BaseNeoEntity(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BaseNeoEntity setId(String id) {
        this.id = id;
        return this;
    }

    public BaseNeoEntity setName(String name) {
        this.name = name;
        return this;
    }
}
