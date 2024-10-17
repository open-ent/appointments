package fr.openent.appointments.core.constants;

public class SqlTables {
    
    public static final String DB_SCHEMA = "appointments";
    public static final String DB_GRID_TABLE = DB_SCHEMA + ".grid";
    public static final String DB_GRID_STATE_TABLE = DB_SCHEMA + ".grid_state";
    public static final String DB_DAILY_SLOT_TABLE = DB_SCHEMA + ".daily_slot";
    public static final String DB_TIME_SLOT_TABLE = DB_SCHEMA + ".time_slot";
    public static final String DB_APPOINTMENT_TABLE = DB_SCHEMA + ".appointment";
    public static final String DB_APPOINTMENT_STATE_TABLE = DB_SCHEMA + ".appointment_state";

    private SqlTables() {
        throw new IllegalStateException("Utility class");
    }
}
