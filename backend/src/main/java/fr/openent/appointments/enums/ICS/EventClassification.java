package fr.openent.appointments.enums.ICS;

import java.util.Arrays;

public enum EventClassification {
  PUBLIC("PUBLIC"),
  PRIVATE("PRIVATE"),
  CONFIDENTIAL("CONFIDENTIAL");

  private final String value;

  EventClassification(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }

  public static EventClassification getStatus(String value) {
     return Arrays.stream(EventClassification.values())
             .filter(classification -> classification.getValue().equals(value))
             .findFirst()
             .orElse(null);
  }
}