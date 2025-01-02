package fr.openent.appointments.enums;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum UserFunction {
  NO_OBJECT("SANS OBJET"),
  RELATIVE("PARENT"),
  PERSONNEL("PERSONNEL"),
  TEACHER("PROFESSEUR"),
  GUEST("INVITÉ"),
  SANS_DISCIPLINE("SANS DISCIPLINE"),
  SANS_SPECIALITE("SANS SPECIALITE"),
  PROFESSEUR("PROFESSEUR"),
  INFIRMIERE("INFIRMIÈRE"),
  ETABLISSEMENT("ÉTABLISSEMENT"),
  EDUCATION("ÉDUCATION"),
  ELEVE("ÉLÈVE"),
  MATHEMATIQUES("MATHÉMATIQUES"),
  GEOGRAPHIE("GÉOGRAPHIE");

  private final String value;

  UserFunction(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }

  public static UserFunction getUserFunction(String value) {
     return Arrays.stream(UserFunction.values())
             .filter(userFunction -> userFunction.getValue().equals(value))
             .findFirst()
             .orElse(null);
  }

  public static List<String> getAllKeys() {
    return Arrays.stream(UserFunction.values()).map(Enum::name).collect(Collectors.toList());
  }

  public static List<String> getAllValues() {
    return Arrays.stream(UserFunction.values()).map(UserFunction::getValue).collect(Collectors.toList());
  }
}