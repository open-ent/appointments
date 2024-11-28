package fr.openent.appointments.service.impl;

import fr.openent.appointments.service.NotifyService;
import fr.openent.appointments.service.ServiceFactory;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import org.entcore.common.notification.TimelineHelper;
import org.entcore.common.user.UserInfos;

import java.util.Collections;
import java.util.List;

import static fr.openent.appointments.core.constants.Constants.*;

public class DefaultNotifyService implements NotifyService {
    private final TimelineHelper timelineHelper;

    public DefaultNotifyService(ServiceFactory serviceFactory) {
        this.timelineHelper = serviceFactory.timelineHelper();
    }

    @Override
    public void notifyNewAppointment(HttpServerRequest request, UserInfos requesterUser, String targetUserId){
        String appointmentUri = "/appointments";

        JsonObject params = new JsonObject()
            .put(CAMEL_USER_NAME, requesterUser.getUsername())
            .put(CAMEL_USER_URI, "/userbook/annuaire#" + requesterUser.getUserId())
            .put(CAMEL_APPOINTMENT_URI, appointmentUri)
            .put(CAMEL_PUSH_NOTIF, new JsonObject().put(TITLE, "appointments.new_appointment_notification").put(BODY, ""));

        List<String> targetUsers = Collections.singletonList(targetUserId);

        timelineHelper.notifyTimeline(request, "appointments.new_appointment_notification", requesterUser, targetUsers, params);
    }
}
