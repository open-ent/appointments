package fr.openent.appointments.service;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.AppointmentWithInfos;
import fr.openent.appointments.model.response.ListAppointmentsResponse;
import fr.openent.appointments.model.response.MinimalAppointment;
import io.vertx.core.Future;
import org.entcore.common.user.UserInfos;

import java.util.List;

public interface AppointmentService {

    /**
     *
     * @param timeSlotId The time slot id
     * @param userId The user id
     * @param userGroupsIds The user groups ids
     * @return if the user can access the time slot
     */
    public Future<Boolean> checkIfUserCanAccessTimeSlot(Long timeSlotId, String userId, List<String> userGroupsIds);


    /**
     *
     * @param timeSlotId The time slot id
     * @return if the time slot is available
     */
    public Future<Boolean> checkIfTimeSlotIsAvailable(Long timeSlotId);

    /**
     *  Create an appointment linked to a time slot
     *
     *  @param timeSlotId The time slot id
     *  @param userId The user id
     *  @param isVideoCall The user choice for video call
     *  @return The created appointment
     */
    Future<Appointment> create(Long timeSlotId, String userId, Boolean isVideoCall);

    /**
     * Get appointments of a user
     * @param userInfos The user infos
     * @param states The states of the appointments
     * @param page The page number
     * @param limit The limit of the number of appointments
     * @return The list of appointments
     */
    Future<ListAppointmentsResponse> getMyAppointments(UserInfos userInfos, List<AppointmentState> states, Long page, Long limit);

    /**
     * Get appointment by its id
     * @param appointmentId The appointment id
     * @param userId The user id
     * @return The appointment
     */
    Future<AppointmentWithInfos> getAppointmentById(Long appointmentId, String userId);

}
