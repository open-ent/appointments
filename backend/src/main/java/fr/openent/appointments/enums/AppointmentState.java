package fr.openent.appointments.enums;

import java.util.Arrays;

public enum AppointmentState {
    CREATED("CREATED"),
    ACCEPTED("ACCEPTED"),
    REFUSED("REFUSED"),
    CANCELED("CANCELED");

    private final String value;

    AppointmentState(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static AppointmentState getAppointmentState(String value) {
        return Arrays.stream(AppointmentState.values())
                .filter(appointmentState -> appointmentState.getValue().equals(value))
                .findFirst()
                .orElse(null);
    }
}
