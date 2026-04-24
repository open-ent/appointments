package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;

import java.time.LocalDate;

import static fr.openent.appointments.core.constants.Fields.*;

public class LinkerGrid implements IModel<LinkerGrid> {
    private Long id;
    private String name;
    private String ownerId;
    private String ownerName;
    private String updatingDate;
    private String color;

    // Constructor

    public LinkerGrid(JsonObject grid) {
        this.id = grid.getLong(ID, null);
        this.name = grid.getString(NAME, null);
        this.ownerId = grid.getString(OWNER_ID, null);
        this.ownerName = grid.getString(OWNER_NAME, null);
        this.updatingDate = DateHelper.parseDate(grid.getString(UPDATING_DATE, null).substring(0,10)).toString();
        this.color = grid.getString(COLOR, null);
    }

    public LinkerGrid(Grid grid, String ownerName) {
        this.id = grid.getId();
        this.name = grid.getName();
        this.ownerId = grid.getOwnerId();
        this.ownerName = ownerName;
        this.updatingDate = grid.getUpdatingDate().toString();
        this.color = grid.getColor();
    }

    // Getter

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public String getUpdatingDate() {
        return updatingDate;
    }

    public String getColor() {
        return color;
    }

    // Setter

    public LinkerGrid setId(Long id) {
        this.id = id;
        return this;
    }

    public LinkerGrid setName(String name) {
        this.name = name;
        return this;
    }

    public LinkerGrid setOwnerId(String ownerId) {
        this.ownerId = ownerId;
        return this;
    }

    public LinkerGrid setOwnerName(String ownerName) {
        this.ownerName = ownerName;
        return this;
    }

    public LinkerGrid setUpdatingDate(String updatingDate) {
        this.updatingDate = updatingDate;
        return this;
    }

    public LinkerGrid setColor(String color) {
        this.color = color;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
