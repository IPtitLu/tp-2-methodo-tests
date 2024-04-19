/**
 * @swagger
 * tags:
 *   name: Session
 *   description: Opérations liées aux sessions
 * /api/sessions/{id}:
 *   get:
 *     summary: Récupère une session par ID
 *     description: Récupère une session spécifique en fonction de son ID.
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la session à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session récupérée avec succès
 *       400:
 *         description: Bad Request – client sent an invalid request, such as lacking required request body or parameter
 *       401:
 *         description: Unauthorized – client failed to authenticate with the server
 *       403:
 *         description: Forbidden – client authenticated but does not have permission to access the requested resource
 *       404:
 *         description: Not Found – the requested resource does not exist
 *       412:
 *         description: Precondition Failed – one or more conditions in the request header fields evaluated to false
 *       500:
 *         description: Internal Server Error – a generic error occurred on the server
 *       505:
 *         description: Service Unavailable – the requested service is not available
 *   delete:
 *     summary: Supprime une session par ID
 *     description: Supprime une session spécifique en fonction de son ID.
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la session à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session supprimée avec succès
 *       400:
 *         description: Bad Request – client sent an invalid request, such as lacking required request body or parameter
 *       401:
 *         description: Unauthorized – client failed to authenticate with the server
 *       403:
 *         description: Forbidden – client authenticated but does not have permission to access the requested resource
 *       404:
 *         description: Not Found – the requested resource does not exist
 *       412:
 *         description: Precondition Failed – one or more conditions in the request header fields evaluated to false
 *       500:
 *         description: Internal Server Error – a generic error occurred on the server
 *       505:
 *         description: Service Unavailable – the requested service is not available
 * /api/sessions/:
 *   get:
 *     summary: Récupère toutes les sessions
 *     description: Récupère toutes les sessions enregistrées.
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Sessions récupérées avec succès
 *       500:
 *         description: Erreur serveur lors de la récupération des sessions
 *   post:
 *     summary: Crée une nouvelle session
 *     description: Crée une nouvelle session avec les données fournies.
 *     tags: [Session]
 *     responses:
 *       201:
 *         description: Session créée avec succès
 *       400:
 *         description: Bad Request – client sent an invalid request, such as lacking required request body or parameter
 *       401:
 *         description: Unauthorized – client failed to authenticate with the server
 *       403:
 *         description: Forbidden – client authenticated but does not have permission to access the requested resource
 *       404:
 *         description: Not Found – the requested resource does not exist
 *       412:
 *         description: Precondition Failed – one or more conditions in the request header fields evaluated to false
 *       500:
 *         description: Internal Server Error – a generic error occurred on the server
 *       505:
 *         description: Service Unavailable – the requested service is not available
 *   put:
 *     summary: Met à jour une session
 *     description: Met à jour une session existante avec les données fournies.
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Session mise à jour avec succès
 *       404:
 *         description: Session non trouvée
 *   delete:
 *     summary: Supprime toutes les sessions
 *     description: Supprime toutes les sessions enregistrées.
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Sessions supprimées avec succès
 *       400:
 *         description: Bad Request – client sent an invalid request, such as lacking required request body or parameter
 *       401:
 *         description: Unauthorized – client failed to authenticate with the server
 *       403:
 *         description: Forbidden – client authenticated but does not have permission to access the requested resource
 *       404:
 *         description: Not Found – the requested resource does not exist
 *       412:
 *         description: Precondition Failed – one or more conditions in the request header fields evaluated to false
 *       500:
 *         description: Internal Server Error – a generic error occurred on the server
 *       505:
 *         description: Service Unavailable – the requested service is not available
 * /api/sessions/start:
 *   post:
 *     summary: Démarre une nouvelle session
 *     description: Démarre une nouvelle session avec l'ID de l'utilisateur et l'heure de début fournis.
 *     tags: [Session]
 *     parameters: 
 *      - name: userid
 *        in: body
 *        required: true
 *        schema:
 *        type: string
 *      - name: DateDebut
 *        in: body
 *        required: true
 *        schema:
 *        type: string
 *     responses:
 *       201:
 *         description: Session démarrée avec succès
 *       400:
 *         description: Bad Request – client sent an invalid request, such as lacking required request body or parameter
 *       401:
 *         description: Unauthorized – client failed to authenticate with the server
 *       403:
 *         description: Forbidden – client authenticated but does not have permission to access the requested resource
 *       404:
 *         description: Not Found – the requested resource does not exist
 *       412:
 *         description: Precondition Failed – one or more conditions in the request header fields evaluated to false
 *       500:
 *         description: Internal Server Error – a generic error occurred on the server
 *       505:
 *         description: Service Unavailable – the requested service is not available
 * /api/sessions/end:
 *   post:
 *     summary: Termine une session existante
 *     description: Termine une session existante avec l'ID de la session et l'heure de fin fournis.
 *     tags: [Session]
 *     parameters: 
 *      - name: sessionid
 *        in: body
 *        required: true
 *        schema:
 *        type: string
 *      - name: DateFin
 *        in: body
 *        required: true
 *        schema:
 *        type: string
 *     responses:
 *       200:
 *         description: Session terminée avec succès
 *       400:
 *         description: Bad Request – client sent an invalid request, such as lacking required request body or parameter
 *       401:
 *         description: Unauthorized – client failed to authenticate with the server
 *       403:
 *         description: Forbidden – client authenticated but does not have permission to access the requested resource
 *       404:
 *         description: Not Found – the requested resource does not exist
 *       412:
 *         description: Precondition Failed – one or more conditions in the request header fields evaluated to false
 *       500:
 *         description: Internal Server Error – a generic error occurred on the server
 *       505:
 *         description: Service Unavailable – the requested service is not available
 * /api/sessions/pause:
 *   post:
 *     summary: Ajoute une pause à une session
 *     description: Ajoute une pause à une session existante avec l'ID de la session, l'heure de début et l'heure de fin de la pause fournis.
 *     tags: [Session]
 *     parameters: 
 *      - name: sessionid
 *        in: body
 *        required: true
 *        schema:
 *        type: string
 *      - name: DateDebut
 *        in: body
 *        required: true
 *        schema:
 *        type: string
 *      - name: DateFin
 *        in: body
 *        required: true
 *        schema:
 *        type: string
 *     responses:
 *       200:
 *         description: Pause ajoutée avec succès
 *       400:
 *         description: Bad Request – client sent an invalid request, such as lacking required request body or parameter
 *       401:
 *         description: Unauthorized – client failed to authenticate with the server
 *       403:
 *         description: Forbidden – client authenticated but does not have permission to access the requested resource
 *       404:
 *         description: Not Found – the requested resource does not exist
 *       412:
 *         description: Precondition Failed – one or more conditions in the request header fields evaluated to false
 *       500:
 *         description: Internal Server Error – a generic error occurred on the server
 *       505:
 *         description: Service Unavailable – the requested service is not available
 */
