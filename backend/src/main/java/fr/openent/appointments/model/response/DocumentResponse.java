package fr.openent.appointments.model.response;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.workspace.CompleteDocument;
import io.vertx.core.json.JsonObject;

public class DocumentResponse implements IModel<DocumentResponse> {
    private String id;
    private String name;
    private Long size;
    private String ownerId;
    private String ownerName;

    public DocumentResponse(CompleteDocument document) {
        this.id = document.getId();
        this.name = document.getName();
        this.size = document.getMetaData().getSize();
        this.ownerId = document.getOwner();
        this.ownerName = document.getOwnerName();
    }

    // Getters

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getSize() {
        return size;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    // Setters

    public DocumentResponse setId(String id) {
        this.id = id;
        return this;
    }

    public DocumentResponse setName(String name) {
        this.name = name;
        return this;
    }

    public DocumentResponse setSize(Long size) {
        this.size = size;
        return this;
    }

    public DocumentResponse setOwnerId(String ownerId) {
        this.ownerId = ownerId;
        return this;
    }

    public DocumentResponse setOwnerName(String ownerName) {
        this.ownerName = ownerName;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
