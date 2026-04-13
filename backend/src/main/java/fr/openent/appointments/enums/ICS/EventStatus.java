package fr.openent.appointments.enums.ICS;

import java.util.Arrays;

public enum EventStatus {
  CONFIRMED("CONFIRMED"),
  TENTATIVE("TENTATIVE"),
  CANCELLED("CANCELLED");

  private final String value;

  EventStatus(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }

  public static EventStatus getStatus(String value) {
     return Arrays.stream(EventStatus.values())
             .filter(status -> status.getValue().equals(value))
             .findFirst()
             .orElse(null);
  }
}