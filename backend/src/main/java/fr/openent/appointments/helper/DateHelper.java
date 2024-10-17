package fr.openent.appointments.helper;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateHelper {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    
    public static LocalDate parseDate(String date) {
        if (date == null || date.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(date, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    public static String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DATE_FORMATTER);
    }

    public static Duration parseDuration(String duration) {
        if (duration == null || duration.isEmpty()) {
            return null;
        }
        String[] parts = duration.split(":");
        if (parts.length != 2) {
            return null;
        }
        try {
            long hours = Long.parseLong(parts[0]);
            long minutes = Long.parseLong(parts[1]);
            return Duration.ofHours(hours).plusMinutes(minutes);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static String formatDuration(Duration duration) {
        if (duration == null) {
            return null;
        }
        long hours = duration.toHours();
        long minutes = duration.minusHours(hours).toMinutes();
        return String.format("%02d:%02d", hours, minutes);
    }

    public static LocalTime parseTime(String time) {
        if (time == null || time.isEmpty()) {
            return null;
        }
        try {
            return LocalTime.parse(time, TIME_FORMATTER);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    public static String formatTime(LocalTime time) {
        if (time == null) {
            return null;
        }
        return time.format(TIME_FORMATTER);
    }
}
