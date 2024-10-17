package fr.openent.appointments.enums;

import java.util.Arrays;

public enum Actions {
  RAW("raw"),
  PREPARED("prepared"),
  TRANSACTION("transaction"),
  SELECT("select"),
  INSERT("insert"),
  UPSERT("upsert");

  private final String value;

  Actions(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }

  public static Actions getAction(String value) {
     return Arrays.stream(Actions.values())
             .filter(actions -> actions.getValue().equals(value))
             .findFirst()
             .orElse(null);
  }
}