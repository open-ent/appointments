package fr.openent.appointments.model.response;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.helper.IModelHelper;
import fr.openent.appointments.model.IModel;
import fr.openent.appointments.model.database.AppointmentWithInfos;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.*;
import static fr.openent.appointments.core.constants.Constants.*;

import java.time.LocalDateTime;
import java.util.List;

public class MinimalAppointment implements IModel<MinimalAppointment> {
    private Long id;
    private String displayName;
    private List<String> functions;
    private String picture;
    private LocalDateTime beginDate;
    private LocalDateTime endDate;
    private String videoCallLink;
    private AppointmentState state;
    private Boolean isRequester;

    public MinimalAppointment(AppointmentWithInfos appointmentWithInfos, Boolean isRequester, String displayName, List<String> functions, String picture) {
        this.id = appointmentWithInfos.getId();
        this.displayName = displayName;
        this.functions = functions;
        this.picture = picture;
        this.beginDate = appointmentWithInfos.getBeginDate();
        this.endDate = appointmentWithInfos.getEndDate();
        this.videoCallLink = appointmentWithInfos.getVideoCallLink();
        this.state = appointmentWithInfos.getState();
        this.isRequester = isRequester;
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

    public String getVideoCallLink() {
        return videoCallLink;
    }

    public AppointmentState getState() {
        return state;
    }

    public Boolean getIsRequester() {
        return isRequester;
    }

    // Setters

    public MinimalAppointment setId(Long id) {
        this.id = id;
        return this;
    }

    public MinimalAppointment setDisplayName(String displayName) {
        this.displayName = displayName;
        return this;
    }

    public MinimalAppointment setFunctions(List<String> functions) {
        this.functions = functions;
        return this;
    }

    public MinimalAppointment setPicture(String picture) {
        this.picture = picture;
        return this;
    }

    public MinimalAppointment setBeginDate(LocalDateTime beginDate) {
        this.beginDate = beginDate;
        return this;
    }

    public MinimalAppointment setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
        return this;
    }

    public MinimalAppointment setVideoCallLink(String videoCallLink) {
        this.videoCallLink = videoCallLink;
        return this;
    }

    public MinimalAppointment setState(AppointmentState state) {
        this.state = state;
        return this;
    }

    public MinimalAppointment setIsRequester(Boolean isRequester) {
        this.isRequester = isRequester;
        return this;
    }

    // Functions

    public JsonObject toJson() {
        return IModelHelper.toJson(this, false, false);
    }
}
