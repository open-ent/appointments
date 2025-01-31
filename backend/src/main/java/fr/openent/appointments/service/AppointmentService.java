package fr.openent.appointments.service;

import fr.openent.appointments.enums.AppointmentState;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.AppointmentWithInfos;
import fr.openent.appointments.model.response.AppointmentResponse;
import fr.openent.appointments.model.response.ListAppointmentsResponse;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServerRequest;
import org.entcore.common.user.UserInfos;

import java.time.LocalDate;
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
     * Get dates of appointments with a specific state of a user
     * @param userId The user id
     * @param states The states of the appointments
     */
    Future<List<LocalDate>> getAppointmentsDates(String userId, List<AppointmentState> states);

    /**
     * Get appointment by its id
     * @param appointmentId The appointment id
     * @param userInfos The user infos
     * @return The appointment
     */
    Future<AppointmentResponse> getAppointmentById(Long appointmentId, UserInfos userInfos);

    /**
     * Get all accepted appointments linked to a grid
     * @param gridId The grid id
     * @return The list of appointments
     */
    Future<List<Appointment>> getAcceptedAppointment(Long gridId);

    /**
     * Get all accepted or created appointments linked to a grid
     * @param gridId The grid id
     * @return The list of appointments
     */
    Future<List<Appointment>> getAcceptedOrCreatedAppointment(Long gridId);

    /**
     * Accept an appointment
     * @param request The http request
     * @param appointmentId The appointment id
     * @param userInfos The user infos
     * @return The updated appointment
     */
    Future<Appointment> acceptAppointment(final HttpServerRequest request, Long appointmentId, UserInfos userInfos);

    /**
     * reject an appointment
     * @param request The http request
     * @param appointmentId The appointment id
     * @param userInfos The user infos
     * @return The updated appointment
     */
    Future<Appointment> rejectAppointment(final HttpServerRequest request, Long appointmentId, UserInfos userInfos);

    /**
     * Cancel an appointment
     * @param request The http request
     * @param appointmentId The appointment id
     * @param userInfos The user infos
     * @return The updated appointment
     */
    Future<Appointment> cancelAppointment(final HttpServerRequest request, Long appointmentId, UserInfos userInfos);
}
