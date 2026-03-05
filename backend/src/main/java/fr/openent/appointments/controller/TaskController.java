package fr.openent.appointments.controller;

import fr.openent.appointments.cron.ClosingCron;
import fr.wseduc.rs.Post;
import fr.wseduc.webutils.http.BaseController;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

public class TaskController extends BaseController {
	protected static final Logger log = LoggerFactory.getLogger(TaskController.class);

	final ClosingCron closingCron;

	public TaskController(ClosingCron closingCron) {
		this.closingCron = closingCron;
	}

	@Post("api/internal/closing-passed-grid")
	public void closingPassedGrid(HttpServerRequest request) {
		log.info("Triggered closing passed grid task");
		closingCron.handle(0L);
		render(request, null, 202);
	}
}
