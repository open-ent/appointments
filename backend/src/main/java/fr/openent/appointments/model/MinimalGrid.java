package fr.openent.appointments.model;

import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;

import java.time.LocalDate;

import static fr.openent.appointments.core.constants.Fields.*;

public abstract class MinimalGrid {

    private Long id;
    private String name;
    private String structureId;
    private LocalDate beginDate;
    private LocalDate endDate;
    private LocalDate creationDate;
    private String color;
    private GridState state;

    // Constructor

    public MinimalGrid(JsonObject grid) {
        this.id = grid.getLong(ID, null);
        this.name = grid.getString(NAME, null);
        this.structureId = grid.getString(STRUCTURE_ID, null);
        this.beginDate = DateHelper.parseDate(grid.getString(BEGIN_DATE, null).substring(0, 10));
        this.endDate = DateHelper.parseDate(grid.getString(END_DATE, null).substring(0, 10));
        this.creationDate = DateHelper.parseDate(grid.getString(CREATION_DATE, null).substring(0, 10));
        this.color = grid.getString(COLOR, null);
        this.state = GridState.getGridState(grid.getString(STATE, null));
    }

    public MinimalGrid(Grid grid) {
        this.id = grid.getId();
        this.name = grid.getName();
        this.structureId = grid.getStructureId();
        this.beginDate = grid.getBeginDate();
        this.endDate = grid.getEndDate();
        this.creationDate = grid.getCreationDate();
        this.color = grid.getColor();
        this.state = grid.getState();
    }

    // Getter

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getStructureId() {
        return structureId;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public String getColor() {
        return color;
    }

    public GridState getState() {
        return state;
    }

    // Setter

    public MinimalGrid setId(Long id) {
        this.id = id;
        return this;
    }

    public MinimalGrid setName(String name) {
        this.name = name;
        return this;
    }

    public MinimalGrid setStructureId(String structureId) {
        this.structureId = structureId;
        return this;
    }

    public MinimalGrid setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public MinimalGrid setEndDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public MinimalGrid setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public MinimalGrid setColor(String color) {
        this.color = color;
        return this;
    }

    public MinimalGrid setState(GridState state) {
        this.state = state;
        return this;
    }
}
