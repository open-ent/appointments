package fr.openent.appointments.enums;

import java.util.Arrays;

public enum Day {
    MONDAY("MONDAY"),
    TUESDAY("TUESDAY"),
    WEDNESDAY("WEDNESDAY"),
    THURSDAY("THURSDAY"),
    FRIDAY("FRIDAY"),
    SATURDAY("SATURDAY"),
    SUNDAY("SUNDAY");

    private final String value;

    Day(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Day getDay(String value) {
        return Arrays.stream(Day.values())
                .filter(day -> day.getValue().equals(value))
                .findFirst()
                .orElse(null);
    }
}
