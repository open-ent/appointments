package fr.openent.appointments.enums;

import java.util.Arrays;

public enum GridState {
    OPEN("OPEN"),
    SUSPENDED("SUSPENDED"),
    CLOSED("CLOSED"),
    DELETED("DELETED");

    private final String value;

    GridState(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static GridState getGridState(String value) {
        return Arrays.stream(GridState.values())
                .filter(gridState -> gridState.getValue().equals(value))
                .findFirst()
                .orElse(null);
    }
}
