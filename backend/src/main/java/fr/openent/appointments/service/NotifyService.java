package fr.openent.appointments.service;

import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import org.entcore.common.user.UserInfos;

public interface NotifyService {

    /**
     * Notify new appointment
     *
     * @param request         Http server request
     * @param requesterUser   Requester user
     * @param targetUserId    Target user id
     */
    void notifyNewAppointment(HttpServerRequest request, UserInfos requesterUser, String targetUserId);
}
