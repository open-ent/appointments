package fr.openent.appointments.model.ICS;

public class AttachmentICS {
    private String filename;
    private String mimeType;
    private byte[] data;

    // Constructors

    public AttachmentICS(String filename, String mimeType, byte[] data) {
        this.filename = filename;
        this.mimeType = mimeType;
        this.data = data;
    }

    // Getters

    public String getFilename() {
        return filename;
    }

    public String getMimeType() {
        return mimeType;
    }
    public byte[] getData() {
        return data;
    }

    // Setters

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}
