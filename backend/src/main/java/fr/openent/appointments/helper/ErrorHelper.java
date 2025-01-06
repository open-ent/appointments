package fr.openent.appointments.helper;


import fr.openent.appointments.exceptions.CustomException;
import io.vertx.core.http.HttpServerRequest;
import fr.openent.appointments.enums.HttpStatus;
import io.vertx.core.json.JsonObject;

import static fr.openent.appointments.core.constants.Fields.ERROR;
import static fr.wseduc.webutils.http.Renders.*;

public class ErrorHelper {
    private static final int DEFAULT_ERROR_CODE = HttpStatus.INTERNAL_SERVER_ERROR.getCode();
    private static final String DEFAULT_ERROR_MESSAGE = HttpStatus.INTERNAL_SERVER_ERROR.getMessage();
    private static final String WRONG_CODE_ERROR = "The code is not a known error code : %s";

    public static void respond(HttpServerRequest request) {
        renderError(request);
    }

    public static void respond(HttpServerRequest request, String errorMessage) {
        renderError(request, new JsonObject().put(ERROR, errorMessage));
    }

    public static void respond(HttpServerRequest request, Throwable err) {
        if (!(err instanceof CustomException)) {
            respond(request);
            return;
        }

        int code = extractErrorCode(err);
        String errormessage = extractMessage(err);

        // Get HttpStatus enum from code
        HttpStatus httpStatus = HttpStatus.getHttpStatus(code);
        if (httpStatus == null) {
            renderError(request, new JsonObject().put(ERROR, String.format(WRONG_CODE_ERROR, code)));
            return;
        }

        // Render response according to http status
        switch(httpStatus) {
            case BAD_REQUEST: // 400
                if (errormessage != null) badRequest(request, errormessage);
                else badRequest(request);
                break;
            case UNAUTHORIZED: // 401
                if (errormessage != null) unauthorized(request, errormessage);
                else unauthorized(request);
                break;
            case FORBIDDEN: // 403
                if (errormessage != null) forbidden(request, errormessage);
                else forbidden(request);
                break;
            case NOT_FOUND: // 404
                if (errormessage != null) notFound(request, errormessage);
                else notFound(request);
                break;
            case CONFLICT: // 409
                if (errormessage != null) conflict(request, errormessage);
                else conflict(request);
                break;
            case INTERNAL_SERVER_ERROR: // 500
                if (errormessage != null) renderError(request, new JsonObject().put(ERROR, errormessage));
                else renderError(request);
                break;
            default:
                renderError(request, new JsonObject().put(ERROR, String.format(WRONG_CODE_ERROR, code)));
                break;
        }
    }

    // Private functions

    private static Integer extractErrorCode(Throwable err) {
        return err instanceof CustomException ? ((CustomException) err).getHttpStatus().getCode() : null;
    }

    private static String extractMessage(Throwable err) {
        return err instanceof CustomException ? err.getMessage() : null;
    }
}
