import { DateTime } from 'luxon';

class SessionService {
  constructor(repository, userService) {
    this.repository = repository;
    this.userService = userService;
  }

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
    // Vérifier si l'utilisateur existe
    const userExists = await this.userService.checkUserExists(userId);
    if (!userExists) {
      throw new Error('User not found');
    }

    // Convertir la date de début dans le format approprié
    const formattedDateDebut = DateTime.fromISO(dateDebut).toUTC().toJSDate();

    // if (!formattedDateDebut.isValid) {
    //   throw new Error('Invalid start date');
    // }

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

    // Créer et enregistrer la nouvelle session
    const newSession = await this.repository.create({
      userId,
      dateDebut: formattedDateDebut,
      dateFin,
    });
    return newSession;
  };

  /*
  startSession = async (userId, dateDebut) => {
      // Vérifier si l'utilisateur existe
      const userExists = await this.userService.checkUserExists(userId);
      if (!userExists) {
        throw new Error('User not found');
      }

      // Convertir la date de début dans le format approprié
      const formattedDateDebut = DateTime.fromISO(dateDebut);

      // Vérifier si la date de début est valide
      if (!formattedDateDebut.isValid) {
        throw new Error('Invalid start date');
      }

      // Vérifier si la date de fin est antérieure à la date de début
      const now = DateTime.now();
      if (formattedDateDebut.toMillis() > now.toMillis()) {
        throw new Error('End date is before start date');
      }

      // Vérifier si une session se chevauche avec la date de début
      const sessionsWithin24Hours = await this.repository.getSessionsWithinRange(
        formattedDateDebut,
        formattedDateDebut,
      );
      if (sessionsWithin24Hours.length > 0) {
        throw new Error('Another session is already in progress');
      }

      // Calculer la durée totale des sessions précédentes dans les 24 heures précédentes
      const startDate = DateTime.fromJSDate(formattedDateDebut.toJSDate()).startOf('day');
      const endDate = DateTime.fromJSDate(formattedDateDebut.toJSDate()).endOf('day');
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
      const dateFin = DateTime.fromJSDate(formattedDateDebut.toJSDate())
        .plus({ milliseconds: remainingDuration })
        .toJSDate();

      // Créer et enregistrer la nouvelle session
      const newSession = await this.repository.create({
        userId,
        dateDebut: formattedDateDebut.toJSDate(),
        dateFin,
      });
      return newSession;
    };
  */

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

  calculateAverageDuration = async (sessions) => {
    if (sessions.length === 0) {
      return 0;
    }

    const totalDuration = sessions.reduce(
      (acc, session) => acc + session.duree,
      0,
    );
    return totalDuration / sessions.length;
  };

  calculateMinDuration = async (sessions) => {
    if (sessions.length === 0) {
      return 0;
    }

    return Math.min(...sessions.map((session) => session.duree));
  };

  calculateMaxDuration = async (sessions) => {
    if (sessions.length === 0) {
      return 0;
    }

    return Math.max(...sessions.map((session) => session.duree));
  };

  calculateMedianDuration = async (sessions) => {
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
  };

  calculateMaxGapBetweenPorts = async (sessions) => {
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
  };
}

export default SessionService;
