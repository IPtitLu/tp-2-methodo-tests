import express from 'express';

class UserRouter {
  constructor(userController) {
    this.userController = userController;
  }

  getRouter() {
    const router = express.Router();
    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Récupère un utilisateur par ID
     *     description: Récupère un utilisateur spécifique en fonction de son ID.
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
     *       404:
     *         description: Utilisateur non trouvé
     */
    router.route('/:id').get(this.userController.getUserById);
    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Supprime un utilisateur par ID
     *     description: Supprime un utilisateur spécifique en fonction de son ID.
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
     */
    router.route('/:id').delete(this.userController.deleteUserById);
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Récupère la liste des utilisateurs
     *     description: Récupère la liste complète des utilisateurs enregistrés dans le système.
     *     responses:
     *       200:
     *         description: Liste des utilisateurs récupérée avec succès
     */
    router.route('/').get(this.userController.getUsers);
    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Crée un nouvel utilisateur
     *     description: Crée un nouvel utilisateur dans le système.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: Utilisateur créé avec succès
     */
    router.route('/').post(this.userController.createUser);
    /**
     * @swagger
     * /users:
     *   put:
     *     summary: Met à jour un utilisateur existant
     *     description: Met à jour un utilisateur existant dans le système.
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
     */
    router.route('/').put(this.userController.updateUser);
    /**
     * @swagger
     * /users:
     *   delete:
     *     summary: Supprime tous les utilisateurs
     *     description: Supprime tous les utilisateurs enregistrés dans le système.
     *     responses:
     *       204:
     *         description: Utilisateurs supprimés avec succès
     */
    router.route('/').delete(this.userController.deleteUsers);
    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: Connecte un utilisateur
     *     description: Connecte un utilisateur existant dans le système.
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
    router.route('/login').post(this.userController.login);
    return router;
  }
}

export default UserRouter;
