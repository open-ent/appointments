package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;
import static fr.openent.appointments.core.constants.Fields.*;

public class MinimalGridInfos extends BaseMinimalGrid implements IModel<MinimalGridInfos> {
    private Duration duration;
    private String videoCallLink;
    private String place;
    private List<DocumentResponse> documents;
    private String publicComment;

    // Constructor

    public MinimalGridInfos(Grid grid, List<DocumentResponse> documents) {
        super(grid);
        this.setDuration(grid.getDuration());
        this.setVideoCallLink(grid.getVideoCallLink());
        this.setPlace(grid.getPlace());
        this.setDocuments(documents);
        this.setPublicComment(grid.getPublicComment());
    }

    // Getter

    public Duration getDuration() {
        return duration;
    }

    public String getVideoCallLink() {
        return videoCallLink;
    }

    public String getPlace() {
        return place;
    }

    public List<DocumentResponse> getDocuments() {
        return documents;
    }

    public String getPublicComment() {
        return publicComment;
    }

    // Setter

    public MinimalGridInfos setDuration(Duration duration) {
        this.duration = duration;
        return this;
    }

    public MinimalGridInfos setVideoCallLink(String videoCallLink) {
        this.videoCallLink = videoCallLink;
        return this;
    }

    public MinimalGridInfos setPlace(String place) {
        this.place = place;
        return this;
    }

    public MinimalGridInfos setDocuments(List<DocumentResponse> documents) {
        this.documents = documents;
        return this;
    }

    public MinimalGridInfos setPublicComment(String publicComment) {
        this.publicComment = publicComment;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
