package fr.openent.appointments.enums.ICS;

import java.util.Arrays;

public enum EventTransparency {
  OPAQUE("OPAQUE"),
  TRANSPARENT("TRANSPARENT");

  private final String value;

  EventTransparency(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }

  public static EventTransparency getStatus(String value) {
     return Arrays.stream(EventTransparency.values())
             .filter(transparency -> transparency.getValue().equals(value))
             .findFirst()
             .orElse(null);
  }
}