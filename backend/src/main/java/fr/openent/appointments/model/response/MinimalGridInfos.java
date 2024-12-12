package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.Grid;
import io.vertx.core.json.JsonObject;

import java.time.Duration;

import static fr.openent.appointments.core.constants.Constants.CAMEL_DOCUMENT_ID;
import static fr.openent.appointments.core.constants.Constants.CAMEL_PUBLIC_COMMENT;
import static fr.openent.appointments.core.constants.Fields.*;

public class MinimalGridInfos extends BaseMinimalGrid implements IModel<MinimalGridInfos> {
    private Duration duration;
    private String visioLink;
    private String place;
    private String documentId;
    private String publicComment;

    // Constructor

    public MinimalGridInfos(JsonObject grid) {
        super(grid);
        this.duration = DateHelper.parseDuration(grid.getString(DURATION,null));
        this.visioLink = grid.getString(CAMEL_DOCUMENT_ID, null);
        this.place = grid.getString(PLACE, null);
        this.documentId = grid.getString(CAMEL_DOCUMENT_ID, null);
        this.publicComment = grid.getString(CAMEL_PUBLIC_COMMENT, null);
    }

    public MinimalGridInfos(Grid grid) {
        super(grid);
        this.setDuration(grid.getDuration());
        this.setVisioLink(grid.getVisioLink());
        this.setPlace(grid.getPlace());
        this.setDocumentId(grid.getDocumentId());
        this.setPublicComment(grid.getPublicComment());
    }

    // Getter

    public Duration getDuration() {
        return duration;
    }

    public String getVisioLink() {
        return visioLink;
    }

    public String getPlace() {
        return place;
    }

    public String getDocumentId() {
        return documentId;
    }

    public String getPublicComment() {
        return publicComment;
    }

    // Setter

    public MinimalGridInfos setDuration(Duration duration) {
        this.duration = duration;
        return this;
    }

    public MinimalGridInfos setVisioLink(String visioLink) {
        this.visioLink = visioLink;
        return this;
    }

    public MinimalGridInfos setPlace(String place) {
        this.place = place;
        return this;
    }

    public MinimalGridInfos setDocumentId(String documentId) {
        this.documentId = documentId;
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
