package fr.openent.appointments.service;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.model.database.Appointment;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import org.entcore.common.user.UserInfos;

import java.util.List;

public interface NotifyService {

    /**
     * Notify new appointment
     *
     * @param request         Http server request
     * @param requesterUser   Requester user
     * @param targetUserId    Target user id
     * @param appointmentId   Appointment id
     */
    void notifyNewAppointment(HttpServerRequest request, UserInfos requesterUser, String targetUserId, Long appointmentId);

    /**
     * Notify appointment update
     *
     * @param request         Http server request
     * @param actionUserInfos Action user infos
     * @param prevState       Previous appointment state
     * @param appointmentId   Appointment id
     */
    void notifyAppointmentUpdate(HttpServerRequest request, UserInfos actionUserInfos, AppointmentState prevState, Long appointmentId);

    /**
     * Notify appointment infos update
     *
     * @param request         Http server request
     * @param actionUserInfos Action user infos
     * @param appointments    List of appointments impacted by grid changes
     */
    void notifyGridUpdate(HttpServerRequest request, UserInfos actionUserInfos, List<Appointment> appointments, boolean isStateUpdated);
}
