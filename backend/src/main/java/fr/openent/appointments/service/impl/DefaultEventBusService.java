package fr.openent.appointments.service.impl;

import fr.openent.appointments.helper.EventBusHelper;
import fr.openent.appointments.helper.LogHelper;
import fr.openent.appointments.model.database.Grid;
import fr.openent.appointments.model.response.DocumentResponse;
import fr.openent.appointments.model.workspace.CompleteDocument;
import fr.openent.appointments.service.EventBusService;
import fr.openent.appointments.service.ServiceFactory;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static fr.openent.appointments.core.constants.Constants.*;
import static fr.openent.appointments.core.constants.EbFields.LIST;
import static fr.openent.appointments.core.constants.EbFields.WORKSPACE_EB_ADDRESS;

public class DefaultEventBusService implements EventBusService {
    private final EventBus eb;

    public DefaultEventBusService(ServiceFactory serviceFactory) {
        this.eb = serviceFactory.eventBus();
    }

    @Override
    public Future<List<DocumentResponse>> getDocumentResponseFromGrid(String userId, List<String> documentsIds) {
        if(documentsIds == null || documentsIds.isEmpty()) {
            return Future.succeededFuture(new ArrayList<>());
        }
        Promise<List<DocumentResponse>> promise = Promise.promise();

        JsonObject ebMessage = new JsonObject()
                .put(ACTION, LIST)
                .put(CAMEL_USER_ID, userId)
                .put(FILTER, ALL)
                .put(INCLUDEALL, true);

        EventBusHelper.requestJsonArray(WORKSPACE_EB_ADDRESS, eb, ebMessage)
                .onSuccess(documents -> {
                    // all documents of user
                    List<CompleteDocument> completeDocuments = documents.stream()
                            .map(JsonObject::mapFrom)
                            .map(CompleteDocument::new)
                            .collect(Collectors.toList());
                    // documents of grid
                    List<CompleteDocument> filteredDocuments = completeDocuments.stream()
                            .filter(document -> documentsIds.contains(document.getId()))
                            .collect(Collectors.toList());
                    // documents response
                    List<DocumentResponse> documentResponses = filteredDocuments.stream()
                            .map(DocumentResponse::new)
                            .collect(Collectors.toList());
                    promise.complete(documentResponses);
                })
                .onFailure(err -> {
                    String errorMessage = "Failed to get documents from grid";
                    LogHelper.logError(this, "getDocumentResponseFromGrid", errorMessage, err.getMessage());
                    promise.complete(new ArrayList<>());
                });

        return promise.future();
    }
}
