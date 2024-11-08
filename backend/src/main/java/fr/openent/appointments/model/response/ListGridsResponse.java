package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.MinimalCreatorGrid;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;

import java.util.List;
import java.util.stream.Collectors;

public class ListGridsResponse implements IModel<ListGridsResponse> {

    private Long total;
    private List<MinimalCreatorGrid> minimalCreatorGrids;

    // Constructor

    public ListGridsResponse(Long total, List<Grid> grids) {
        this.total = total;
        this.minimalCreatorGrids = grids.stream()
                .map(MinimalCreatorGrid::new)
                .collect(Collectors.toList());
    }

    // Getter

    public Long getTotal() {
        return total;
    }

    public List<MinimalCreatorGrid> getMinimalCreatorGrids() {
        return minimalCreatorGrids;
    }

    // Setter

    public ListGridsResponse setTotal(Long total) {
        this.total = total;
        return this;
    }

    public ListGridsResponse setMinimalCreatorGrids(List<MinimalCreatorGrid> minimalCreatorGrids) {
        this.minimalCreatorGrids = minimalCreatorGrids;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, true, true);
    }
}
