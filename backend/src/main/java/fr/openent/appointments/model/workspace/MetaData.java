package fr.openent.appointments.model.workspace;

import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.*;

public class MetaData implements IModel<MetaData> {
    private String charSet;
    private String contentTransferEncoding;
    private String contentType;
    private String fileName;
    private String name;
    private Long size;

    public MetaData(JsonObject  data) {
        this.charSet = data.getString(CHARSET, "");
        this.contentTransferEncoding = data.getString(CONTENT_TRANSFER_ENCODING, "");
        this.contentType = data.getString(CONTENT_TYPE, "");
        this.fileName = data.getString(FILENAME, "");
        this.name = data.getString(NAME, "");
        this.size = data.getLong(SIZE, 0L);
    }

    // Getters

    public String getCharSet() {
        return charSet;
    }

    public String getContentTransferEncoding() {
        return contentTransferEncoding;
    }

    public String getContentType() {
        return contentType;
    }

    public String getFileName() {
        return fileName;
    }

    public String getName() {
        return name;
    }

    public Long getSize() {
        return size;
    }

    // Setters

    public MetaData setCharSet(String charSet) {
        this.charSet = charSet;
        return this;
    }

    public MetaData setContentTransferEncoding(String contentTransferEncoding) {
        this.contentTransferEncoding = contentTransferEncoding;
        return this;
    }

    public MetaData setContentType(String contentType) {
        this.contentType = contentType;
        return this;
    }

    public MetaData setFileName(String fileName) {
        this.fileName = fileName;
        return this;
    }

    public MetaData setName(String name) {
        this.name = name;
        return this;
    }

    public MetaData setSize(Long size) {
        this.size = size;
        return this;
    }

    // Functions
    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
