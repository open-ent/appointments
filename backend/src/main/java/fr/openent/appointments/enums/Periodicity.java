package fr.openent.appointments.enums;

import java.util.Arrays;

public enum Periodicity {
    WEEKLY(1),
    FORTNIGHTLY(2);

    private final Integer value;

    Periodicity(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }

    public static Periodicity getPeriodicity(Integer value) {
        return Arrays.stream(Periodicity.values())
                .filter(periodicity -> periodicity.getValue().equals(value))
                .findFirst()
                .orElse(null);
    }
}
