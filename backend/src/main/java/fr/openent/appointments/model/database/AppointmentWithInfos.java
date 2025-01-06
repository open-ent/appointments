package fr.openent.appointments.model.database;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.DateHelper;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import io.vertx.core.json.JsonObject;
import static fr.openent.appointments.core.constants.Fields.*;
import java.time.LocalDateTime;

public class AppointmentWithInfos implements IModel<AppointmentWithInfos> {

    private Long id;
    private Long timeSlotId;
    private String requesterId;
    private AppointmentState state;
    private Boolean isVideoCall;
    private LocalDateTime beginDate;
    private LocalDateTime endDate;
    private String ownerId;
    private String videoCallLink;
    private String place;
    private String documentId;
    private String publicComment;

    public AppointmentWithInfos(JsonObject appointmentWithInfos) {
        this.id = appointmentWithInfos.getLong(ID, null);
        this.timeSlotId = appointmentWithInfos.getLong(TIME_SLOT_ID, null);
        this.requesterId = appointmentWithInfos.getString(REQUESTER_ID, null);
        this.state = AppointmentState.getAppointmentState(appointmentWithInfos.getString(STATE, null));
        this.isVideoCall = appointmentWithInfos.getBoolean(IS_VIDEO_CALL, null);
        this.beginDate = DateHelper.parseDateTime(appointmentWithInfos.getString(BEGIN_DATE, null));
        this.endDate = DateHelper.parseDateTime(appointmentWithInfos.getString(END_DATE, null));
        this.ownerId = appointmentWithInfos.getString(OWNER_ID, null);
        this.videoCallLink = appointmentWithInfos.getString(VIDEO_CALL_LINK, null);
        this.place = appointmentWithInfos.getString(PLACE, null);
        this.documentId = appointmentWithInfos.getString(DOCUMENT_ID, null);
        this.publicComment = appointmentWithInfos.getString(PUBLIC_COMMENT, null);
    }

    // Getters

    public Long getId() {
        return this.id;
    }

    public Long getTimeSlotId() {
        return this.timeSlotId;
    }

    public String getRequesterId() {
        return this.requesterId;
    }

    public AppointmentState getState() {
        return this.state;
    }

    public Boolean getIsVideoCall() {
        return this.isVideoCall;
    }

    public LocalDateTime getBeginDate() {
        return this.beginDate;
    }

    public LocalDateTime getEndDate() {
        return this.endDate;
    }

    public String getOwnerId() {
        return this.ownerId;
    }

    public String getVideoCallLink() {
        return this.videoCallLink;
    }

    public String getPlace() {
        return this.place;
    }

    public String getDocumentId() {
        return this.documentId;
    }

    public String getPublicComment() {
        return this.publicComment;
    }

    // Setters

    public AppointmentWithInfos setId(Long id) {
        this.id = id;
        return this;
    }

    public AppointmentWithInfos setTimeSlotId(Long timeSlotId) {
        this.timeSlotId = timeSlotId;
        return this;
    }

    public AppointmentWithInfos setRequesterId(String requesterId) {
        this.requesterId = requesterId;
        return this;
    }

    public AppointmentWithInfos setState(AppointmentState state) {
        this.state = state;
        return this;
    }

    public AppointmentWithInfos setIsVideoCall(Boolean isVideoCall) {
        this.isVideoCall = isVideoCall;
        return this;
    }

    public AppointmentWithInfos setBeginDate(LocalDateTime beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public AppointmentWithInfos setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
        return this;
    }

    public AppointmentWithInfos setOwnerId(String ownerId) {
        this.ownerId = ownerId;
        return this;
    }

    public AppointmentWithInfos setVideoCallLink(String videoCallLink) {
        this.videoCallLink = videoCallLink;
        return this;
    }

    public AppointmentWithInfos setPlace(String place) {
        this.place = place;
        return this;
    }

    public AppointmentWithInfos setDocumentId(String documentId) {
        this.documentId = documentId;
        return this;
    }

    public AppointmentWithInfos setPublicComment(String publicComment) {
        this.publicComment = publicComment;
        return this;
    }

    // Functions

    public JsonObject toJson() { return IModelHelper.toJson(this, false, false); }

}