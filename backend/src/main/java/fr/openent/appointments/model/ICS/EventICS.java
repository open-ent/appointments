package fr.openent.appointments.model.ICS;

import fr.openent.appointments.enums.ICS.EventClassification;
import fr.openent.appointments.enums.ICS.EventStatus;
import fr.openent.appointments.enums.ICS.EventTransparency;
import fr.openent.appointments.model.database.AppointmentWithInfos;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static fr.openent.appointments.helper.ICSHelper.buildEventICSSummary;

public class EventICS {
    private String uid;             // identifiant unique global (ex: uuid@domain)
    private String summary;         // titre
    private String description;
    private String location;
    private String organizer;       // mailto:xxx@domain.com
    private List<String> attendees; // mailto:xxx@domain.com

    private LocalDateTime start;
    private LocalDateTime end;
    private LocalDateTime stamp;  // date de génération du fichier
    private LocalDateTime created;
    private LocalDateTime modified;

    private EventStatus status;
    private EventTransparency transparency;
    private EventClassification classification;
    private Integer sequence;                   // version de l'event (0, 1, 2...)
    private String rrule;                       // règle de récurrence (ex: FREQ=WEEKLY;COUNT=10)
    private String url;

    private static final DateTimeFormatter ICS_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");

    // Constructors

    public EventICS(AppointmentWithInfos appointment, String otherMemberDisplayName) {
        this.uid = appointment.getId() + "@cgi.com";
        this.summary = buildEventICSSummary(otherMemberDisplayName, appointment.getGridName());
        this.description = appointment.getPublicComment();
        this.location = appointment.getIsVideoCall() ? appointment.getVideoCallLink() : appointment.getPlace();
        this.url = appointment.getVideoCallLink();
        this.start = appointment.getBeginDate();
        this.end = appointment.getEndDate();
        this.stamp = LocalDateTime.now();
        this.sequence = Math.toIntExact(stamp.toEpochSecond(ZoneOffset.UTC));
    }

    // Sérialisation ICS

    public String toICS() {
        StringBuilder sb = new StringBuilder();

        sb.append("BEGIN:VEVENT\r\n");
        appendIfPresent(sb, "UID", uid);
        appendIfPresent(sb, "SUMMARY", summary);
        appendIfPresent(sb, "DESCRIPTION", description);
        appendIfPresent(sb, "LOCATION", location);
        appendIfPresent(sb, "URL", url);
        appendIfPresent(sb, "RRULE", rrule);

        if (status != null) sb.append("STATUS:").append(status.name()).append("\r\n");
        if (transparency != null) sb.append("TRANSP:").append(transparency.name()).append("\r\n");
        if (classification != null) sb.append("CLASS:").append(classification.name()).append("\r\n");
        if (sequence != null) sb.append("SEQUENCE:").append(sequence).append("\r\n");
        if (organizer != null) sb.append("ORGANIZER:").append(organizer).append("\r\n");
        if (attendees != null) attendees.forEach(a -> sb.append("ATTENDEE:").append(a).append("\r\n"));

        appendDate(sb, "DTSTART", start);
        appendDate(sb, "DTEND", end);
        appendDate(sb, "DTSTAMP", stamp);
        appendDate(sb, "CREATED", created);
        appendDate(sb, "LAST-MODIFIED", modified);

        sb.append("END:VEVENT\r\n");

        return sb.toString();
    }

    private void appendIfPresent(StringBuilder sb, String key, String value) {
        if (value != null && !value.isEmpty())
            sb.append(key).append(":").append(value).append("\r\n");
    }

    private void appendDate(StringBuilder sb, String key, LocalDateTime dt) {
        if (dt != null)
            sb.append(key).append(":").append(dt.format(ICS_FORMATTER)).append("\r\n");
    }

    // Getters

    public String getUid() { return uid; }
    public String getSummary() { return summary; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public String getOrganizer() { return organizer; }
    public List<String> getAttendees() { return attendees; }
    public EventStatus getStatus() { return status; }
    public EventTransparency getTransparency() { return transparency; }
    public EventClassification getClassification() { return classification; }
    public Integer getSequence() { return sequence; }
    public String getRrule() { return rrule; }
    public String getUrl() { return url; }
    public LocalDateTime getStart() { return start; }
    public LocalDateTime getEnd() { return end; }
    public LocalDateTime getStamp() { return stamp; }
    public LocalDateTime getCreated() { return created; }
    public LocalDateTime getModified() { return modified; }

    // Setters

    public EventICS setUid(String uid) {
        this.uid = uid;
        return this;
    }

    public EventICS setSummary(String summary) {
        this.summary = summary;
        return this;
    }

    public EventICS setDescription(String description) {
        this.description = description;
        return this;
    }
    
    public EventICS setLocation(String location) {
        this.location = location;
        return this;
    }

    public EventICS setOrganizer(String organizer) {
        this.organizer = organizer;
        return this;
    }

    public EventICS setAttendees(List<String> attendees) {
        this.attendees = attendees;
        return this;
    }

    public EventICS addAttendee(String attendee) {
        this.attendees.add(attendee);
        return this;
    }

    public EventICS setStatus(EventStatus status) {
        this.status = status;
        return this;
    }

    public EventICS setTransp(EventTransparency transparency) {
        this.transparency = transparency;
        return this;
    }

    public EventICS setClassification(EventClassification classification) {
        this.classification = classification;
        return this;
    }

    public EventICS setSequence(Integer sequence) {
        this.sequence = sequence;
        return this;
    }

    public EventICS setRrule(String rrule) {
        this.rrule = rrule;
        return this;
    }

    public EventICS setUrl(String url) {
        this.url = url;
        return this;
    }

    public EventICS setStart(LocalDateTime dtStart) {
        this.start = dtStart;
        return this;
    }

    public EventICS setEnd(LocalDateTime dtEnd) {
        this.end = dtEnd;
        return this;
    }

    public EventICS setCreated(LocalDateTime created) {
        this.created = created;
        return this;
    }

    public EventICS setModified(LocalDateTime modified) {
        this.modified = modified;
        return this;
    }
}
