package fr.openent.appointments.security;

import fr.openent.appointments.core.constants.WorkflowRight;

public enum WorkflowActions {
    VIEW_RIGHT (WorkflowRight.VIEW),
    MANAGE_RIGHT (WorkflowRight.MANAGE);

    private final String actionName;

    WorkflowActions(String actionName) {
        this.actionName = actionName;
    }

    @Override
    public String toString () {
        return this.actionName;
    }
}