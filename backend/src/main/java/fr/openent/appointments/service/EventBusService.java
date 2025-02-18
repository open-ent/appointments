package fr.openent.appointments.service;

import fr.openent.appointments.model.database.Grid;
import fr.openent.appointments.model.response.DocumentResponse;
import io.vertx.core.Future;

import java.util.List;

public interface EventBusService {

    /**
     * Retrieve user's document from documentsIds of its grid
     * @param userId user id
     * @param documentsIds list of documents ids from grid
     * @return future list of document response
     */
    Future<List<DocumentResponse>> getDocumentResponseFromGrid(String userId, List<String> documentsIds);
}
