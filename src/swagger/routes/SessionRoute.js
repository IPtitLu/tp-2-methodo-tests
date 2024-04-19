/**
 * @swagger
 * tags:
 *   name: Session
 *   description: Opérations liées aux sessions
 * /api/sessions/{id}:
 *   get:
 *     summary: Récupère une session par ID
 *     description: Récupère une session spécifique en fonction de son ID.
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
 *       404:
 *         description: Session non trouvée
 *   delete:
 *     summary: Supprime une session par ID
 *     description: Supprime une session spécifique en fonction de son ID.
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
 *       404:
 *         description: Session non trouvée
 * /api/sessions/:
 *   get:
 *     summary: Récupère toutes les sessions
 *     description: Récupère toutes les sessions enregistrées.
 *     responses:
 *       200:
 *         description: Sessions récupérées avec succès
 *       500:
 *         description: Erreur serveur lors de la récupération des sessions
 *   post:
 *     summary: Crée une nouvelle session
 *     description: Crée une nouvelle session avec les données fournies.
 *     responses:
 *       201:
 *         description: Session créée avec succès
 *       403:
 *         description: Impossible de créer la session
 *   put:
 *     summary: Met à jour une session
 *     description: Met à jour une session existante avec les données fournies.
 *     responses:
 *       200:
 *         description: Session mise à jour avec succès
 *       404:
 *         description: Session non trouvée
 *   delete:
 *     summary: Supprime toutes les sessions
 *     description: Supprime toutes les sessions enregistrées.
 *     responses:
 *       200:
 *         description: Sessions supprimées avec succès
 *       500:
 *         description: Erreur serveur lors de la suppression des sessions
 * /api/sessions/start:
 *   post:
 *     summary: Démarre une nouvelle session
 *     description: Démarre une nouvelle session avec l'ID de l'utilisateur et l'heure de début fournis.
 *     responses:
 *       201:
 *         description: Session démarrée avec succès
 *       403:
 *         description: Impossible de démarrer la session
 * /api/sessions/end:
 *   post:
 *     summary: Termine une session existante
 *     description: Termine une session existante avec l'ID de la session et l'heure de fin fournis.
 *     responses:
 *       200:
 *         description: Session terminée avec succès
 *       404:
 *         description: Session non trouvée
 * /api/sessions/pause:
 *   post:
 *     summary: Ajoute une pause à une session
 *     description: Ajoute une pause à une session existante avec l'ID de la session, l'heure de début et l'heure de fin de la pause fournis.
 *     responses:
 *       200:
 *         description: Pause ajoutée avec succès
 *       404:
 *         description: Session non trouvée
 */
