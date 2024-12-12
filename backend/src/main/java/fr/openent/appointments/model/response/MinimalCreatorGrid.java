package fr.openent.appointments.model.response;

import fr.openent.appointments.enums.GridState;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;

import java.time.LocalDate;

import static fr.openent.appointments.core.constants.Fields.*;

public class MinimalCreatorGrid extends BaseMinimalGrid implements IModel<MinimalCreatorGrid> {
    private String structureId;
    private LocalDate beginDate;
    private LocalDate endDate;
    private String color;
    private GridState state;

    // Constructor

    public MinimalCreatorGrid(JsonObject grid) {
        super(grid);
        this.structureId = grid.getString(STRUCTURE_ID, null);
        this.beginDate = DateHelper.parseDate(grid.getString(BEGIN_DATE, null).substring(0, 10));
        this.endDate = DateHelper.parseDate(grid.getString(END_DATE, null).substring(0, 10));
        this.color = grid.getString(COLOR, null);
        this.state = GridState.getGridState(grid.getString(STATE, null));
    }

    public MinimalCreatorGrid(Grid grid) {
        super(grid);
        this.structureId = grid.getStructureId();
        this.beginDate = grid.getBeginDate();
        this.endDate = grid.getEndDate();
        this.color = grid.getColor();
        this.state = grid.getState();
    }

    // Getter

    public String getStructureId() {
        return structureId;
    }

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getColor() {
        return color;
    }

    public GridState getState() {
        return state;
    }

    // Setter

    public MinimalCreatorGrid setStructureId(String structureId) {
        this.structureId = structureId;
        return this;
    }

    public MinimalCreatorGrid setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public MinimalCreatorGrid setEndDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public MinimalCreatorGrid setColor(String color) {
        this.color = color;
        return this;
    }

    public MinimalCreatorGrid setState(GridState state) {
        this.state = state;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
