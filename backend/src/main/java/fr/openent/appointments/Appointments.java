package fr.openent.appointments;

import fr.openent.appointments.controller.AppointmentsController;
import io.vertx.core.eventbus.EventBus;
import org.entcore.common.http.BaseServer;

public class Appointments extends BaseServer {

    public static final String VIEW_RIGHT = "appointments.view";

    @Override
    public void start() throws Exception {
        super.start();

        EventBus eb = getEventBus(vertx);

        addController(new AppointmentsController());
    }
}