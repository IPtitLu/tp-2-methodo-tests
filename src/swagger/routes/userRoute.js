/**
 * @swagger
 * tags:
 *   name: User
 *   description: Opérations liées aux utilisateurs
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     description: Récupère un utilisateur spécifique en fonction de son ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
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
 *     summary: Supprime un utilisateur par ID
 *     description: Supprime un utilisateur spécifique en fonction de son ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 * /users:
 *   get:
 *     summary: Récupère la liste des utilisateurs
 *     description: Récupère la liste complète des utilisateurs enregistrés dans le système.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Crée un nouvel utilisateur dans le système.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *   put:
 *     summary: Met à jour un utilisateur existant
 *     description: Met à jour un utilisateur existant dans le système.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *   delete:
 *     summary: Supprime tous les utilisateurs
 *     description: Supprime tous les utilisateurs enregistrés dans le système.
 *     tags: [User]
 *     responses:
 *       204:
 *         description: Utilisateurs supprimés avec succès
 * /users/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     description: Connecte un utilisateur existant dans le système.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès
 *       401:
 *         description: Connexion non autorisée
 */
