package fr.openent.appointments.enums;

import java.util.Arrays;

public enum HttpStatus {
  OK(200, "OK"),
  CREATED(201, "Created"),
  NO_CONTENT(204, "No Content"),
  BAD_REQUEST(400, "Bad Request"),
  UNAUTHORIZED(401, "Unauthorized"),
  FORBIDDEN(403, "Forbidden"),
  NOT_FOUND(404, "Not Found"),
  CONFLICT(409, "Conflict"),
  INTERNAL_SERVER_ERROR(500, "Internal Server Error");

  private final int code;
  private final String message;

  HttpStatus(int code, String message) {
    this.code = code;
    this.message = message;
  }

  public int getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public static HttpStatus getHttpStatus(int code) {
    return Arrays.stream(HttpStatus.values())
            .filter(httpStatus -> httpStatus.getCode() == code)
            .findFirst()
            .orElse(null);
  }

  @Override
  public String toString() {
    return String.format("%d3 %s", code, message);
  }
}