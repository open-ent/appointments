package fr.openent.appointments.core.constants;

public class Constants {
    // camelCase constants
    public static final String CAMEL_ACTOR_ID = "actorId";
    public static final String CAMEL_BEGIN_DATE = "beginDate";
    public static final String CAMEL_BEGIN_TIME = "beginTime";
    public static final String CAMEL_CREATION_DATE = "creationDate";
    public static final String CAMEL_DAILY_SLOTS = "dailySlots";
    public static final String CAMEL_DISPLAY_NAME = "displayName";
    public static final String CAMEL_DOCUMENT_ID = "documentId";
    public static final String CAMEL_END_DATE = "endDate";
    public static final String CAMEL_END_TIME = "endTime";
    public static final String CAMEL_GRID_ID = "gridId";
    public static final String CAMEL_GRIDS_NAME = "gridsName";
    public static final String CAMEL_GROUPS_IDS = "groupsIds";
    public static final String CAMEL_OWNER_ID = "ownerId";
    public static final String CAMEL_PUBLIC_COMMENT = "publicComment";
    public static final String CAMEL_REQUESTER_ID = "requesterId";
    public static final String CAMEL_STRUCTURE_ID = "structureId";
    public static final String CAMEL_STRUCTURES_EXTERNAL_IDS = "structuresExternalIds";
    public static final String CAMEL_TARGET_PUBLIC_LIST_ID = "targetPublicListId";
    public static final String CAMEL_TIME_SLOT_ID = "timeSlotId";
    public static final String CAMEL_VISIO_LINK = "visioLink";
    public static final String CAMEL_USER_ID = "userId";

    // kebab-case constants
    public static final String KEBAB_CLOSING_CRON = "closing-cron";

    // Other constants
    public static final String ACTION = "action";
    public static final String APPOINTMENTS = "Appointments";
    public static final String APPOINTMENTS_ADDRESS = "fr.openent.appointments";
    public static final String FUNCTIONS = "functions";
    public static final String HOST = "host";
    public static final String LIMIT = "limit";
    public static final String MODE = "mode";
    public static final String PAGE = "page";
    public static final String PICTURE = "picture";
    public static final String PREPARED = "prepared";
    public static final String SEARCH = "search";
    public static final String STATEMENT = "statement";
    public static final String STRUCTURES = "structures";
    public static final String STATES = "states";
    public static final String VALUES = "values";

    private Constants() {
        throw new IllegalStateException("Utility class");
    }
}
