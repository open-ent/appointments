package fr.openent.appointments.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public enum AppointmentState {
    CREATED("CREATED"),
    ACCEPTED("ACCEPTED"),
    REFUSED("REFUSED"),
    CANCELED("CANCELED");

    private final String value;

    AppointmentState(String value) {
        this.value = value;
    }

    public static List<String> getAvailableStates() {
        return Arrays.asList(CREATED.getValue(), ACCEPTED.getValue());
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
