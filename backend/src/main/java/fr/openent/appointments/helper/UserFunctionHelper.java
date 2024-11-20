package fr.openent.appointments.helper;

import fr.openent.appointments.enums.UserFunction;
import fr.openent.appointments.enums.UserFunctionException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserFunctionHelper {
    public static final String DASH = "-";
    public static final String DE = "de ";
    public static final String DOLLAR = "$";
    public static final List<String> CAPITAL_EXCEPTIONS = Arrays.asList("ce", "cpe");

    public static List<String> format(List<String> neoFunctions) {
        if (areFullOfDashFunction(neoFunctions)) {
            return Collections.singletonList(UserFunction.NO_OBJECT.getValue());
        }

        return neoFunctions.stream()
                .map(neoFunction -> format(neoFunction, true))
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public static String format(String neoFunction, boolean ignoreDashFunction) {
        int first$Pos = neoFunction.indexOf(DOLLAR);
        int second$Pos = neoFunction.indexOf(DOLLAR, first$Pos + 1);
        int third$Pos = neoFunction.indexOf(DOLLAR, second$Pos + 1);
        int last$Pos = neoFunction.lastIndexOf(DOLLAR);

        String codeFunction = neoFunction.substring(first$Pos + 1, second$Pos);
        String function = neoFunction.substring(second$Pos + 1, third$Pos);
        String discipline = neoFunction.substring(last$Pos + 1);

        if (DASH.equals(codeFunction)) return ignoreDashFunction ? null : UserFunction.NO_OBJECT.getValue();
        if (UserFunctionException.getAllValues().contains(codeFunction)) return specificFormat(codeFunction, function, discipline);

        return prettifyText(function);
    }

    // Private functions

    private static boolean areFullOfDashFunction(List<String> neoFunctions) {
        return neoFunctions.stream()
                .allMatch(UserFunctionHelper::isDashFunction);
    }

    private static boolean isDashFunction(String neoFunction) {
        int first$Pos = neoFunction.indexOf(DOLLAR);
        int second$Pos = neoFunction.indexOf(DOLLAR, first$Pos + 1);
        String codeFunction = neoFunction.substring(first$Pos + 1, second$Pos);

        return DASH.equals(codeFunction);
    }

    private static String specificFormat(String codeFunction, String function, String discipline) {
        UserFunctionException codeFunctionEnum = UserFunctionException.getUserFunctionException(codeFunction);
        if (codeFunctionEnum == null) return null;

        switch(codeFunctionEnum) {
            case DIR: {
                String value = discipline.equals(UserFunction.SANS_DISCIPLINE.getValue()) ? function : discipline;
                return prettifyText(value);
            }
            case ENS: {
                String value = discipline.equals(UserFunction.SANS_SPECIALITE.getValue()) ? "" : (DE + prettifyText(discipline));
                return prettifyText(UserFunction.PROFESSEUR.getValue()) + " " + value;
            }
            case EDU:
            case MDS:
                return prettifyText(discipline);
            default:
                return null;
        }
    }

    private static String prettifyText(String input) {
        for (String key : UserFunction.getAllKeys()) {
            input = input.replace(key, Enum.valueOf(UserFunction.class, key).getValue());
        }
        return capitalizeFirstLetter(input);
    }

    private static String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) return input;

        String lowerCased = input.toLowerCase();
        String formattedInput = lowerCased.substring(0, 1).toUpperCase() + lowerCased.substring(1);
        return recapitalizeExceptions(formattedInput);
    }

    private static String recapitalizeExceptions(String input) {
        for (String exception : CAPITAL_EXCEPTIONS) {
            input = input.replaceAll("(?<!\\w)" + exception + "(?!\\w)", exception.toUpperCase());
        }
        return input;
    }
}
