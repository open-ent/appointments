package fr.openent.appointments.core.constants;

public class Constants {
    // camelCase constants
    public static final String CAMEL_APPOINTMENT_ID = "appointmentId";
    public static final String CAMEL_APPOINTMENT_URI = "appointmentUri";
    public static final String CAMEL_AVAILABLE_GRIDS_IDS = "availableGridsIds";
    public static final String CAMEL_BEGIN_DATE = "beginDate";
    public static final String CAMEL_BEGIN_TIME = "beginTime";
    public static final String CAMEL_DAILY_SLOTS = "dailySlots";
    public static final String CAMEL_DELETE_APPOINTMENTS = "deleteAppointments";
    public static final String CAMEL_DISPLAY_NAME = "displayName";
    public static final String CAMEL_DOCUMENT_ID = "documentId";
    public static final String CAMEL_END_DATE = "endDate";
    public static final String CAMEL_END_TIME = "endTime";
    public static final String CAMEL_GRID_ID = "gridId";
    public static final String CAMEL_GROUPS_IDS = "groupsIds";
    public static final String CAMEL_HTTP_STATUS = "httpStatus";
    public static final String CAMEL_IS_REQUESTER = "isRequester";
    public static final String CAMEL_IS_VIDEO_CALL = "isVideoCall";
    public static final String CAMEL_PUBLIC_COMMENT = "publicComment";
    public static final String CAMEL_PUSH_NOTIF = "pushNotif";
    public static final String CAMEL_STRUCTURE_ID = "structureId";
    public static final String CAMEL_STRUCTURES_EXTERNAL_IDS = "structuresExternalIds";
    public static final String CAMEL_STRUCTURES_IDS = "structuresIds";
    public static final String CAMEL_TARGET_PUBLIC_LIST_ID = "targetPublicListId";
    public static final String CAMEL_TIME_SLOTS = "timeSlots";
    public static final String CAMEL_TIME_SLOT_ID = "timeSlotId";
    public static final String CAMEL_VIDEO_CALL_LINK = "videoCallLink";
    public static final String CAMEL_USER_NAME = "userName";
    public static final String CAMEL_USER_ID = "userId";
    public static final String CAMEL_USER_INFO = "userInfo";
    public static final String CAMEL_USER_URI = "userUri";

    // kebab-case constants
    public static final String KEBAB_CLOSING_CRON = "closing-cron";
    public static final String KEBAB_MIN_HOURS_BEFORE_CANCELLATION = "min-hours-before-cancellation";

    // Other constants
    public static final String ACTION = "action";
    public static final String APPOINTMENTS = "Appointments";
    public static final String APPOINTMENTS_ADDRESS = "fr.openent.appointments";
    public static final String BODY = "body";
    public static final String CODE = "code";
    public static final String FUNCTIONS = "functions";
    public static final String FRENCH_NOW = "NOW() AT TIME ZONE 'Europe/Paris'";
    public static final String FRENCH_TIME_ZONE = "Europe/Paris";
    public static final String HOST = "host";
    public static final String LIMIT = "limit";
    public static final String MESSAGE = "message";
    public static final String MODE = "mode";
    public static final String PAGE = "page";
    public static final String PICTURE = "picture";
    public static final String PROFILES = "profiles";
    public static final String SEARCH = "search";
    public static final String STATEMENT = "statement";
    public static final String STRUCTURES = "structures";
    public static final String STATES = "states";
    public static final String TITLE = "title";
    public static final String VALUES = "values";

    private Constants() {
        throw new IllegalStateException("Utility class");
    }
}
