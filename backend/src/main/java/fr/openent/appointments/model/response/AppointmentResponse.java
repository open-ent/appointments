package fr.openent.appointments.model.response;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.AppointmentWithInfos;
import io.vertx.core.json.JsonObject;

import java.time.LocalDateTime;
import java.util.List;

public class AppointmentResponse implements IModel<AppointmentResponse> {
    private Long id;
    private String displayName;
    private List<String> functions;
    private String picture;
    private LocalDateTime beginDate;
    private LocalDateTime endDate;
    private Boolean isVideoCall;
    private String videoCallLink;
    private AppointmentState state;
    private Boolean isRequester;
    private String place;
    private String documentId;
    private String publicComment;

    public AppointmentResponse(AppointmentWithInfos appointment, Boolean isRequester, String displayName, List<String> functions, String picture) {
        this.id = appointment.getId();
        this.displayName = displayName;
        this.functions = functions;
        this.picture = picture;
        this.beginDate = appointment.getBeginDate();
        this.endDate = appointment.getEndDate();
        this.isVideoCall = appointment.getIsVideoCall();
        this.videoCallLink = appointment.getVideoCallLink();
        this.state = appointment.getState();
        this.isRequester = isRequester;
        this.place = appointment.getPlace();
        this.documentId = appointment.getDocumentId();
        this.publicComment = appointment.getPublicComment();
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public List<String> getFunctions() {
        return functions;
    }

    public String getPicture() {
        return picture;
    }

    public LocalDateTime getBeginDate() {
        return beginDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public Boolean getIsVideoCall() {
        return isVideoCall;
    }

    public String getVideoCallLink() {
        return videoCallLink;
    }

    public AppointmentState getState() {
        return state;
    }

    public Boolean getIsRequester() {
        return isRequester;
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

    // Setters

    public AppointmentResponse setId(Long id) {
        this.id = id;
        return this;
    }

    public AppointmentResponse setDisplayName(String displayName) {
        this.displayName = displayName;
        return this;
    }

    public AppointmentResponse setFunctions(List<String> functions) {
        this.functions = functions;
        return this;
    }

    public AppointmentResponse setPicture(String picture) {
        this.picture = picture;
        return this;
    }

    public AppointmentResponse setBeginDate(LocalDateTime beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public AppointmentResponse setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
        return this;
    }

    public AppointmentResponse setIsVideoCall(Boolean isVideoCall) {
        this.isVideoCall = isVideoCall;
        return this;
    }

    public AppointmentResponse setVideoCallLink(String videoCallLink) {
        this.videoCallLink = videoCallLink;
        return this;
    }

    public AppointmentResponse setState(AppointmentState state) {
        this.state = state;
        return this;
    }

    public AppointmentResponse setIsRequester(Boolean isRequester) {
        this.isRequester = isRequester;
        return this;
    }

    public AppointmentResponse setPlace(String place) {
        this.place = place;
        return this;
    }

    public AppointmentResponse setDocumentId(String documentId) {
        this.documentId = documentId;
        return this;
    }

    public AppointmentResponse setPublicComment(String publicComment) {
        this.publicComment = publicComment;
        return this;
    }

    // Functions
    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
