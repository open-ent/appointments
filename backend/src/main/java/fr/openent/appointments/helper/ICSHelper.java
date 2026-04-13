package fr.openent.appointments.helper;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.model.database.AppointmentWithInfos;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

import static fr.openent.appointments.core.constants.DateFormat.TIME_FORMAT;

public class ICSHelper {
    public static List<AppointmentState> authorizedStates = Arrays.asList(AppointmentState.CANCELED, AppointmentState.ACCEPTED);

    public static String buildFilename(List<AppointmentWithInfos> appointments, List<AppointmentState> states)
    {
        if (appointments.size() > 1) {
            return states.contains(AppointmentState.CANCELED)
                    ? "1-export_global_annulation.ics"
                    : "2-export_global_création.ics";
        }

        LocalDateTime start = appointments.get(0).getBeginDate();
        LocalDateTime end = appointments.get(0).getEndDate();

        String rdvDateTime = String.format("%s_%s_%s",
                start.toLocalDate(),
                start.format(DateTimeFormatter.ofPattern(TIME_FORMAT)),
                end.format(DateTimeFormatter.ofPattern(TIME_FORMAT))
        );

        return "export_rdv_" + rdvDateTime + ".ics";
    }

    public static String buildEventICSSummary(String otherMemberDisplayName, String gridName) {
        return "RDV avec " + otherMemberDisplayName + " - " + gridName;
    }
}