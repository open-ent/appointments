package fr.openent.appointments.exceptions;

import fr.openent.appointments.enums.HttpStatus;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Constants.*;

public abstract class CustomException extends Exception {
    private final HttpStatus httpStatus;
    private final String message;

    // Constructor

    public CustomException(HttpStatus httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
        this.message = message;
    }

    // Getter

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    @Override
    public String getMessage() {
        return message;
    }

    // Functions

    public JsonObject toJson() {
        return new JsonObject()
                .put(CAMEL_HTTP_STATUS, httpStatus)
                .put(MESSAGE, message);
    }
}
