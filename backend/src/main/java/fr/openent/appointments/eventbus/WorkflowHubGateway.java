package fr.openent.appointments.eventbus;

import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.database.Appointment;
import fr.openent.appointments.model.database.TimeSlot;
import fr.openent.appointments.model.response.MinimalGrid;
import fr.openent.appointments.model.response.TimeSlotsAvailableResponse;
import fr.openent.appointments.service.AppointmentService;
import fr.openent.appointments.service.GridService;
import fr.openent.appointments.service.ServiceFactory;
import fr.openent.appointments.service.TimeSlotService;

import io.vertx.core.Future;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import org.entcore.common.user.UserInfos;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Passerelle <strong>bus applicatif</strong> exposée aux autres modules pour la prise de
 * rendez-vous, sur le modèle du {@code workflowhub.autorisations} que WorkflowHub expose déjà
 * côté carnet de correspondance.
 *
 * <p>WorkflowHub s'en sert pour la démarche « Demande de rendez-vous avec un enseignant » :
 * lister les grilles d'un enseignant que la famille peut voir (ses groupes y sont autorisés),
 * lister les créneaux libres d'une grille, puis réserver un créneau au nom du compte ENT
 * déposant. Rien ici ne contourne les contrôles d'Appointments : chaque action rejoue
 * exactement les vérifications que {@code GridController}/{@code AppointmentController}
 * appliquent à un utilisateur connecté — seuls le canal (bus plutôt que HTTP) et l'identité
 * (transmise par l'appelant, qui a déjà authentifié son propre utilisateur) changent.
 *
 * <p>Adresse : {@link #BUS_ADDRESS}. Payload commun : {@code {action, ...}}. Réponse : le corps
 * documenté par action ci-dessous, ou un échec (code, message) sur tout refus.
 */
public class WorkflowHubGateway {

    /** Fenêtre par défaut d'interrogation des créneaux : aujourd'hui + 60 jours. */
    private static final int FENETRE_JOURS = 60;

    public static final String BUS_ADDRESS = "appointments.rendezvous";

    private final GridService gridService;
    private final TimeSlotService timeSlotService;
    private final AppointmentService appointmentService;

    public WorkflowHubGateway(ServiceFactory serviceFactory) {
        this.gridService = serviceFactory.gridService();
        this.timeSlotService = serviceFactory.timeSlotService();
        this.appointmentService = serviceFactory.appointmentService();
    }

    /** Enregistre le consommateur sur {@link #BUS_ADDRESS}. À appeler une fois au démarrage. */
    public void register(EventBus eb) {
        eb.consumer(BUS_ADDRESS, this::dispatch);
    }

    private void dispatch(Message<JsonObject> message) {
        final JsonObject body = message.body();
        final String action = body == null ? null : body.getString("action");
        if (action == null) {
            message.fail(400, "appointments.rendezvous.action_manquante");
            return;
        }
        switch (action) {
            case "grilles-enseignant":
                grillesEnseignant(message, body);
                return;
            case "creneaux-grille":
                creneauxGrille(message, body);
                return;
            case "reserver":
                reserver(message, body);
                return;
            default:
                message.fail(400, "appointments.rendezvous.action_inconnue");
        }
    }

    private static UserInfos utilisateur(List<String> groupsIds) {
        final UserInfos user = new UserInfos();
        user.setGroupsIds(groupsIds != null ? groupsIds : new ArrayList<>());
        return user;
    }

    private static List<String> groupsIdsDe(JsonObject body) {
        final List<String> out = new ArrayList<>();
        final JsonArray raw = body.getJsonArray("groupsIds", new JsonArray());
        for (int i = 0; i < raw.size(); i++) {
            final String id = raw.getString(i);
            if (id != null && !id.isBlank()) out.add(id);
        }
        return out;
    }

    /**
     * {@code {action:"grilles-enseignant", enseignantId, groupsIds}} → grilles de
     * {@code enseignantId} que les {@code groupsIds} de l'appelant peuvent voir et qui portent
     * au moins un créneau libre. Réponse : {@code {grilles: [{code, label}]}}.
     */
    private void grillesEnseignant(Message<JsonObject> message, JsonObject body) {
        final String enseignantId = body.getString("enseignantId");
        if (enseignantId == null || enseignantId.isBlank()) {
            message.fail(400, "appointments.rendezvous.enseignant_manquant");
            return;
        }
        gridService.getAvailableUserMinimalGrids(utilisateur(groupsIdsDe(body)), enseignantId)
                .onSuccess(grilles -> {
                    final JsonArray out = new JsonArray();
                    for (MinimalGrid grille : grilles) {
                        out.add(new JsonObject()
                                .put("code", String.valueOf(grille.getId()))
                                .put("label", grille.getName()));
                    }
                    message.reply(new JsonObject().put("grilles", out));
                })
                .onFailure(err -> {
                    LogHelper.logError(this, "grillesEnseignant",
                            "Échec de lecture des grilles de " + enseignantId, err.getMessage());
                    message.fail(500, "appointments.rendezvous.erreur");
                });
    }

    /**
     * {@code {action:"creneaux-grille", gridId, groupsIds}} → créneaux libres de la grille sur
     * les {@value #FENETRE_JOURS} prochains jours (rejoue le contrôle d'accès par groupe :
     * échoue si la grille n'est pas partagée avec les {@code groupsIds} de l'appelant).
     * Réponse : {@code {creneaux: [{code, label, debut, fin}]}}.
     */
    private void creneauxGrille(Message<JsonObject> message, JsonObject body) {
        final Long gridId = body.getLong("gridId");
        if (gridId == null) {
            message.fail(400, "appointments.rendezvous.grille_manquante");
            return;
        }
        final LocalDate debut = LocalDate.now();
        final LocalDate fin = debut.plusDays(FENETRE_JOURS);
        timeSlotService.getAvailableTimeSlotsByDates(utilisateur(groupsIdsDe(body)), gridId, debut, fin)
                .onSuccess(reponse -> message.reply(new JsonObject().put("creneaux", creneaux(reponse))))
                .onFailure(err -> {
                    // Grille non partagée avec l'appelant, ou grille inconnue : refus, pas une
                    // erreur serveur — la famille a pu manipuler un id de grille.
                    message.fail(403, "appointments.rendezvous.grille_inaccessible");
                });
    }

    private static final DateTimeFormatter LABEL_JOUR = DateTimeFormatter.ofPattern("dd/MM");

    private static JsonArray creneaux(TimeSlotsAvailableResponse reponse) {
        final JsonArray out = new JsonArray();
        final List<TimeSlot> timeslots = reponse.getTimeslots();
        if (timeslots == null) {
            return out;
        }
        for (TimeSlot slot : timeslots) {
            final String jour = slot.getBeginDate().getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.FRENCH);
            final String label = jour + " " + slot.getBeginDate().format(LABEL_JOUR)
                    + ", " + String.format("%02d:%02d", slot.getBeginDate().getHour(), slot.getBeginDate().getMinute())
                    + "–" + String.format("%02d:%02d", slot.getEndDate().getHour(), slot.getEndDate().getMinute());
            out.add(new JsonObject()
                    .put("code", String.valueOf(slot.getId()))
                    .put("label", label)
                    .put("debut", slot.getBeginDate().toString())
                    .put("fin", slot.getEndDate().toString()));
        }
        return out;
    }

    /**
     * {@code {action:"reserver", timeSlotId, userId, groupsIds, isVideoCall}} → réserve le
     * créneau au nom de {@code userId}. Rejoue exactement la séquence de
     * {@code AppointmentController#createAppointment} : accès par groupe, puis disponibilité,
     * avant de créer le rendez-vous (état {@code CREATED}, à confirmer par l'enseignant dans
     * Appointments). Réponse : {@code {appointmentId, state, gridId}}.
     */
    private void reserver(Message<JsonObject> message, JsonObject body) {
        final Long timeSlotId = body.getLong("timeSlotId");
        final String userId = body.getString("userId");
        if (timeSlotId == null || userId == null || userId.isBlank()) {
            message.fail(400, "appointments.rendezvous.parametres_manquants");
            return;
        }
        final boolean isVideoCall = Boolean.TRUE.equals(body.getBoolean("isVideoCall", false));
        appointmentService.checkIfUserCanAccessTimeSlot(timeSlotId, userId, groupsIdsDe(body))
                .compose(canAccess -> {
                    if (!Boolean.TRUE.equals(canAccess)) {
                        return Future.failedFuture("appointments.rendezvous.creneau_inaccessible");
                    }
                    return appointmentService.checkIfTimeSlotIsAvailable(timeSlotId);
                })
                .compose(isAvailable -> {
                    if (!Boolean.TRUE.equals(isAvailable)) {
                        return Future.failedFuture("appointments.rendezvous.creneau_indisponible");
                    }
                    return appointmentService.create(timeSlotId, userId, isVideoCall);
                })
                .onSuccess((Appointment rdv) -> message.reply(new JsonObject()
                        .put("appointmentId", rdv.getId())
                        .put("state", rdv.getState() != null ? rdv.getState().getValue() : null)
                        .put("timeSlotId", rdv.getTimeSlotId())))
                .onFailure(err -> {
                    final String code = err.getMessage() != null && err.getMessage().startsWith("appointments.rendezvous.")
                            ? err.getMessage() : "appointments.rendezvous.erreur";
                    if (!"appointments.rendezvous.erreur".equals(code)) {
                        message.fail(409, code);
                    } else {
                        LogHelper.logError(this, "reserver", "Échec de réservation du créneau "
                                + timeSlotId + " pour " + userId, err.getMessage());
                        message.fail(500, code);
                    }
                });
    }
}
