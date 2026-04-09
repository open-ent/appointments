package fr.openent.appointments.model.ICS;

import fr.openent.appointments.enums.ICS.EventMethod;

import java.util.List;

public class CalendarICS {
    private EventMethod method;
    private List<EventICS> events;

    // Constructors

    public CalendarICS(List<EventICS> events, EventMethod method) {
        this.method = method;
        this.events = events;
    }

    public CalendarICS(List<EventICS> events) {
        this(events, EventMethod.PUBLISH);
    }

    // Sérialisation ICS

    public String toICS() {
        StringBuilder sb = new StringBuilder();

        sb.append("BEGIN:VCALENDAR\r\n");
        sb.append("VERSION:2.0\r\n");
        sb.append("PRODID:-//CGI Learning Hub//Appointments//FR\r\n");
        appendIfPresent(sb, "METHOD", method.name());

        events.forEach((event) -> sb.append(event.toICS()));

        sb.append("END:VCALENDAR\r\n");

        return sb.toString();
    }

    private void appendIfPresent(StringBuilder sb, String key, String value) {
        if (value != null && !value.isEmpty())
            sb.append(key).append(":").append(value).append("\r\n");
    }

    // Getters
    
    public EventMethod getMethod() { return method; }
    
    // Setters

    public CalendarICS setMethod(EventMethod method) {
        this.method = method;
        return this;
    }
}
