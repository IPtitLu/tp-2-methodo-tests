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

    // Calculer la durée totale des sessions précédentes dans les 24 heures précédentes
    const startDate = DateTime.fromJSDate(formattedDateDebut).startOf('day');
    const endDate = DateTime.fromJSDate(formattedDateDebut).endOf('day');
    const sessionsWithin24Hours = await this.repository.getSessionsWithinRange(
      startDate,
      endDate,
    );
    const totalDurationWithin24Hours = sessionsWithin24Hours.reduce(
      (totalDuration, session) => {
        return totalDuration + session.duration;
      },
      0,
    );

    // Calculer l'heure de fin de la nouvelle session pour atteindre une durée totale de 15 heures
    const remainingDuration = 15 * 60 * 60 * 1000 - totalDurationWithin24Hours;
    const dateFin = DateTime.fromJSDate(formattedDateDebut)
      .plus({ milliseconds: remainingDuration })
      .toJSDate();

    const newSession = await this.repository.create({
      userId,
      dateDebut: formattedDateDebut,
      dateFin,
    });
    return newSession;
  };

  endSession = async (sessionId, dateFin) => {
    const session = await this.repository.getById(sessionId);
    if (!session) {
      throw new Error('Session does not exist');
    }

    // Utilise la date de fin fournie si elle existe, sinon calcule une date de fin
    const newDateFin = dateFin
      ? DateTime.fromISO(dateFin).toJSDate()
      : session.dateDebut;

    session.dateFin = newDateFin;
    return await this.repository.update(session);
  };

  addPauseToSession = async (sessionId, debutPause, finPause) => {
    const session = await this.repository.getById(sessionId);
    if (!session) {
      throw new Error('Session does not exist');
    }
    const formattedDebutPause = DateTime.fromISO(debutPause).toUTC().toJSDate();
    const formattedFinPause = DateTime.fromISO(finPause).toUTC().toJSDate();
    session.pauses.push({
      debutPause: formattedDebutPause,
      finPause: formattedFinPause,
    });
    return await this.repository.update(session);
  };

  calculateSessionMetrics = async (userId) => {
    const sessions = await this.repository.getSessionsByUserId(userId);

    // Calculer la durée moyenne
    const averageDuration = this.calculateAverageDuration(sessions);

    // Calculer la durée minimale
    const minDuration = this.calculateMinDuration(sessions);

    // Calculer la durée maximale
    const maxDuration = this.calculateMaxDuration(sessions);

    // Calculer la médiane
    const medianDuration = this.calculateMedianDuration(sessions);

    // Calculer l'écart maximal entre deux ports
    const maxGapBetweenPorts = this.calculateMaxGapBetweenPorts(sessions);

    return {
      averageDuration,
      minDuration,
      maxDuration,
      medianDuration,
      maxGapBetweenPorts,
    };
  };

  calculateAverageDuration(sessions) {
    if (sessions.length === 0) {
      return 0;
    }

    const totalDuration = sessions.reduce(
      (acc, session) => acc + session.duree,
      0,
    );
    return totalDuration / sessions.length;
  }

  calculateMinDuration(sessions) {
    if (sessions.length === 0) {
      return 0;
    }

    return Math.min(...sessions.map((session) => session.duree));
  }

  calculateMaxDuration(sessions) {
    if (sessions.length === 0) {
      return 0;
    }

    return Math.max(...sessions.map((session) => session.duree));
  }

  calculateMedianDuration(sessions) {
    if (sessions.length === 0) {
      return 0;
    }

    const sortedDurations = sessions
      .map((session) => session.duree)
      .sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedDurations.length / 2);

    if (sortedDurations.length % 2 === 0) {
      return (
        (sortedDurations[middleIndex - 1] + sortedDurations[middleIndex]) / 2
      );
    } else {
      return sortedDurations[middleIndex];
    }
  }

  calculateMaxGapBetweenPorts(sessions) {
    if (sessions.length <= 1) {
      return 0;
    }

    let maxGap = 0;
    for (let i = 1; i < sessions.length; i++) {
      const currentGap = sessions[i].dateDebut - sessions[i - 1].dateFin;
      if (currentGap > maxGap) {
        maxGap = currentGap;
      }
    }
    return maxGap;
  }
}

export default SessionService;
