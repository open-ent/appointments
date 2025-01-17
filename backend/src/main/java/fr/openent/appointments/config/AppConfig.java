package fr.openent.appointments.config;

import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Constants.*;

public class AppConfig {

    private final String host;
    private final String mode;
    private final String closingCron;
    private final Long minHoursBeforeCancellation;

    public AppConfig(JsonObject config) {
        this.host = config.getString(HOST);
        this.mode = config.getString(MODE);
        this.closingCron = config.getString(KEBAB_CLOSING_CRON, "0 0 0 */1 * ? *");
        this.minHoursBeforeCancellation = config.getLong(KEBAB_MIN_HOURS_BEFORE_CANCELLATION, 24L);
    }

    public String host() {
        return this.host;
    }

    public String mode() {
        return this.mode;
    }

    public String closingCron() {
        return this.closingCron;
    }

    public Long minHoursBeforeCancellation() {
        return this.minHoursBeforeCancellation;
    }
}