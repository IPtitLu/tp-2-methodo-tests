import Session from './session.entities.js';

class SessionController {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  updateSession = async (req, res) => {
    try {
      const sessionData = { ...req.body, _id: req.params.id };
      const updatedSession = await this.sessionService.updateSession(
        new Session(sessionData),
      );
      res.status(200).json(updatedSession.toJSON());
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  };

  getSessions = async (__, res) => {
    try {
      const sessions = await this.sessionService.getSessions();
      const sessionsJSON = sessions.map((session) => session.toJSON());
      res.status(200).send(sessionsJSON);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  getSessionById = async (req, res) => {
    try {
      const { id } = req.params;
      const session = await this.sessionService.getSessionById(id);
      res.status(200).json(session.toJSON());
    } catch (err) {
      res.status(404).send({ message: 'Session not found' });
    }
  };

  deleteSessionById = async (req, res) => {
    try {
      const { id } = req.params;
      await this.sessionService.deleteSessionById(id);
      res.status(200).send({ message: 'Session deleted successfully' });
    } catch (err) {
      res.status(404).send({ message: 'Session not found' });
    }
  };

  deleteAllSessions = async (__, res) => {
    try {
      await this.sessionService.deleteAllSessions();
      res.status(200).send({ message: 'All sessions deleted successfully' });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  startSession = async (req, res) => {
    try {
      const { userId, dateDebut } = req.body;

      // Appeler la méthode startSession du service
      const newSession = await this.sessionService.startSession(
        userId,
        dateDebut,
      );

      // Retourner la nouvelle session
      res.status(201).json(newSession.toJSON());
    } catch (err) {
      // Gérer les erreurs
      if (err.message === 'User not found') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(403).send({ message: err.message });
      }
    }
  };

  endSession = async (req, res) => {
    try {
      const { sessionId, dateFin } = req.body;
      const updatedSession = await this.sessionService.endSession(
        sessionId,
        dateFin,
      );
      res.status(200).json(updatedSession.toJSON());
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  };

  addPauseToSession = async (req, res) => {
    try {
      const { sessionId, debutPause, finPause } = req.body;
      await this.sessionService.addPauseToSession(
        sessionId,
        debutPause,
        finPause,
      );
      res.status(200).send({ message: 'Pause added successfully' });
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  };
}

export default SessionController;
