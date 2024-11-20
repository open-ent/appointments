package fr.openent.appointments.enums;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum UserFunctionException {
  DIR("DIR"),
  EDU("EDU"),
  ENS("ENS"),
  MDS("MDS");

  private final String value;

  UserFunctionException(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }

  public static UserFunctionException getUserFunctionException(String value) {
     return Arrays.stream(UserFunctionException.values())
             .filter(userFunctionException -> userFunctionException.getValue().equals(value))
             .findFirst()
             .orElse(null);
  }

  public static List<String> getAllKeys() {
    return Arrays.stream(UserFunctionException.values()).map(Enum::name).collect(Collectors.toList());
  }

  public static List<String> getAllValues() {
    return Arrays.stream(UserFunctionException.values()).map(UserFunctionException::getValue).collect(Collectors.toList());
  }
}