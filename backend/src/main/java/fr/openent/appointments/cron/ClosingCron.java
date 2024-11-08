package fr.openent.appointments.cron;

import fr.openent.appointments.service.GridService;
import fr.openent.appointments.service.ServiceFactory;
import fr.wseduc.webutils.Either;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;


public class ClosingCron extends ControllerHelper implements Handler<Long> {
    private static final Logger log = LoggerFactory.getLogger(ClosingCron.class);
    private final GridService gridService;

    public ClosingCron(ServiceFactory serviceFactory) {
        this.gridService = serviceFactory.gridService();
    }

    @Override
    public void handle(Long event) {
        log.info(String.format("[Appointments@%s::handle] Appointments Closing CRON started", this.getClass().getSimpleName()));
        closeAllPassedGrids(closingEvt -> {
            if (closingEvt.isLeft()) {
                log.error(String.format("[Appointments@%s::handle] Closing CRON failed", this.getClass().getSimpleName()));
            }
            else {
                log.info(String.format("[Appointments@%s::handle] Closing CRON launch successful", this.getClass().getSimpleName()));
            }
        });
    }

    public void closeAllPassedGrids(Handler<Either<String, JsonObject>> handler) {
        gridService.closeAllPassedGrids()
            .onSuccess(result -> handler.handle(new Either.Right<>(new JsonObject())))
            .onFailure(err -> {
                log.error(String.format("[Appointments@%s::closeAllPassedGrids] Failed to close grids ending in the past.", this.getClass().getSimpleName()));
                handler.handle(new Either.Left<>(err.getMessage()));
            });
    }
}
