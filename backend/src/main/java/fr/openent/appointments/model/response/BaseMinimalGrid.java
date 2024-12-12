package fr.openent.appointments.model.response;

import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.ID;
import static fr.openent.appointments.core.constants.Fields.NAME;

public abstract class BaseMinimalGrid {
    private Long id;
    private String name;

    // Constructor

    public BaseMinimalGrid(JsonObject grid) {
        this.id = grid.getLong(ID, null);
        this.name = grid.getString(NAME, null);
    }

    public BaseMinimalGrid(Grid grid) {
        this.id = grid.getId();
        this.name = grid.getName();
    }

    // Getter

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    // Setter

    public BaseMinimalGrid setId(Long id) {
        this.id = id;
        return this;
    }

    public BaseMinimalGrid setName(String name) {
        this.name = name;
        return this;
    }
}
