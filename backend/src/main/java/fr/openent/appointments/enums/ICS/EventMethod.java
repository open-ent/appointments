package fr.openent.appointments.enums.ICS;

import java.util.Arrays;

public enum EventMethod {
  PUBLISH("PUBLISH"),
  REQUEST("REQUEST"),
  CANCEL("CANCEL");

  private final String value;

  EventMethod(String value) {
    this.value = value;
  }

  public static EventStatus getMethod(String value) {
     return Arrays.stream(EventStatus.values())
             .filter(method -> method.getValue().equals(value))
             .findFirst()
             .orElse(null);
  }
}