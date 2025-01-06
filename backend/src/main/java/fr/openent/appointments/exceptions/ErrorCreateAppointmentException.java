package fr.openent.appointments.exceptions;

import fr.openent.appointments.enums.HttpStatus;

public class ErrorCreateAppointmentException extends CustomException {
    static final HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    static final String message = "Error creating new appointment";

    public ErrorCreateAppointmentException() {
        super(httpStatus, message);
    }
}
