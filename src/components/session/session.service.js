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
  }
  
  export default SessionService;
  