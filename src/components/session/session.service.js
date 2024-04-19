import { DateTime } from 'luxon';

class SessionService {
    constructor(repository) {
      this.repository = repository;
    }
  
    addSession = async (sessionData) => {
      // Assuming that sessionData contains all required fields
      // including userId, dateDebut, dateFin, pauses, etc.
      const newSession = await this.repository.create(sessionData);
      return newSession;
    };
  
    updateSession = async (sessionData) => {
      // Assuming that sessionData contains _id to identify the session
      const session = await this.repository.getById(sessionData._id);
      if (!session) {
        throw new Error('Session does not exist');
      }
      return await this.repository.update(sessionData);
    };
  
    getSessions = () => this.repository.getAll();
  
    getSessionById = async (id) => {
      const session = await this.repository.getById(id);
      if (!session) {
        throw new Error('Session does not exist');
      }
      return session;
    };
  
    deleteSessionById = async (id) => {
      const session = await this.repository.getById(id);
      if (!session) {
        throw new Error('Session does not exist');
      }
      await this.repository.deleteById(id);
    };
  
    deleteAllSessions = () => this.repository.deleteAll();
  
    startSession = async (userId, dateDebut) => {
      const formattedDateDebut = DateTime.fromISO(dateDebut).toUTC().toJSDate();
      const newSession = await this.repository.create({ userId, dateDebut: formattedDateDebut });
      return newSession;
    };
  
    endSession = async (sessionId, dateFin) => {
      const session = await this.repository.getById(sessionId);
      if (!session) {
        throw new Error('Session does not exist');
      }
      const formattedDateFin = DateTime.fromISO(dateFin).toUTC().toJSDate();
      session.dateFin = formattedDateFin;
      return await this.repository.update(session);
    };

    addPauseToSession = async (sessionId, debutPause, finPause) => {
      const session = await this.repository.getById(sessionId);
      if (!session) {
        throw new Error('Session does not exist');
      }
      const formattedDebutPause = DateTime.fromISO(debutPause).toUTC().toJSDate();
      const formattedFinPause = DateTime.fromISO(finPause).toUTC().toJSDate();
      session.pauses.push({ debutPause: formattedDebutPause, finPause: formattedFinPause });
      return await this.repository.update(session);
    };
}
  
export default SessionService;
