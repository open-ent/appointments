package fr.openent.appointments.helper;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.model.database.AppointmentWithInfos;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ICSHelper {
    public static String buildFilename(List<AppointmentWithInfos> appointments)
    {
        String filename = "export_global_rdv.ics";
        if(appointments.size() == 1) {
            LocalDateTime start = appointments.get(0).getBeginDate();
            LocalDateTime end = appointments.get(0).getEndDate();

            String rdvDateTime = String.format("%s_%s_%s",
                    start.toLocalDate(),
                    start.format(DateTimeFormatter.ofPattern("HH:mm")),
                    end.format(DateTimeFormatter.ofPattern("HH:mm"))
            );

            filename = "export_rdv_" + rdvDateTime + ".ics";
        }
        return filename;
    }

    public static String buildFinalFilename(String filename, List<AppointmentState> states)
    {
        return states.contains(AppointmentState.CANCELED)
                ? "export_cancelled_" + filename.substring("export_".length())
                : filename;
    }

    public static String buildEventICSSummary(String otherMemberDisplayName, String gridName) {
        return "RDV avec " + otherMemberDisplayName + " - " + gridName;
    }
}