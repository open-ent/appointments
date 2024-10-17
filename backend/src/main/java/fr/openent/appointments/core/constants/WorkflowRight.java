package fr.openent.appointments.core.constants;

public class WorkflowRight {
    public static final String VIEW = "appointments.access";
    public static final String MANAGE = "appointments.manage";

    private WorkflowRight() {
        throw new IllegalStateException("Utility class");
    }
}
