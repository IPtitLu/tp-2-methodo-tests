import Session from './session.entities.js';
import { describe, expect, it, jest } from '@jest/globals';
import SessionService from './session.service.js';
import { DateTime } from 'luxon';
import User from '../user/user.entities.js';
import UserService from '../user/user.service.js';

describe('SessionService', () => {
  const mockSessions = [
    new Session(
      'userId1',
      new Date('2024-04-15T10:30:00Z'),
      new Date('2024-04-15T12:30:00Z'),
      [],
    ),
    new Session(
      'userId2',
      new Date('2024-04-16T10:30:00Z'),
      new Date('2024-04-16T12:30:00Z'),
      [],
    ),
    new Session(
      'userId3',
      new Date('2024-04-17T10:30:00Z'),
      new Date('2024-04-17T12:30:00Z'),
      [],
    ),
    new Session(
      'userId4',
      new Date('2024-04-18T10:30:00Z'),
      new Date('2024-04-18T12:30:00Z'),
      [],
    ),
  ];

  const mockSessionsVide = [];

  const mockSessionRepository = {
    getById: jest.fn((id) => mockSessions[0]), // Mock d'autres méthodes si nécessaire
    getSessionsWithinRange: jest.fn((startDate, endDate) =>
      mockSessions.filter((session) => {
        const sessionDate = new Date(session.dateDebut);
        return sessionDate >= startDate && sessionDate < endDate;
      }),
    ),
    getAll: jest.fn(() => mockSessions),
    deleteById: jest.fn((id) => undefined),
    deleteAll: jest.fn(() => undefined),
    create: jest.fn(
      (session) =>
        new Session(session.userId, session.dateDebut, session.dateFin, []),
    ),
    update: jest.fn((session) => session),
    getSessionsByUserId: jest.fn(async (userId) => {
      const documents = mockSessions.filter(
        (session) => session.userId === userId,
      );
      return documents.map((doc) => Session.fromDocument(doc));
    }),
    getLastSessionByUserId: jest.fn(async (userId) => {
      const sessions = mockSessions.filter(
        (session) => session.userId === userId,
      );
      const sortedSessions = sessions.sort(
        (a, b) => new Date(b.dateFin) - new Date(a.dateFin),
      );
      return sortedSessions.length > 0 ? sortedSessions[0] : undefined;
    }),
  };

  const sessionService = new SessionService(mockSessionRepository);

  const mockUsers = [
    new User('42@email.com', '42', 42, '4200a8f5185294c4fee1b41e'),
    new User('user1@example.com', 'password', 30, '661fa8f5185294c4fee1b41e'),
    new User('user2@example.com', 'password', 31, '001fa8f5185294c4fee1b41e'),
    new User('user3@example.com', 'password', 32, '111fa8f5185294c4fee1b41e'),
  ];

  const mockUserRepository = {
    getById: jest.fn((id) => {
      // Recherchez l'utilisateur correspondant à l'ID donné dans le tableau mockUsers
      const user = mockUsers.find((user) => user.id === id);
      return user;
    }),
  };

  const userService = new UserService(mockUserRepository);

  describe('getSessions', () => {
    it('nominal case - should return an array of all sessions in the database', () => {
      expect(sessionService.getSessions().length).toEqual(4);
    });
  });

  describe('getSessionById', () => {
    it('functional error - should throw an error if the session is not found', async () => {
      const customMockSessionRepository = {
        getById: jest.fn(() => undefined),
      };
      const customSessionService = new SessionService(
        customMockSessionRepository,
      );

      await expect(customSessionService.getSessionById('0')).rejects.toThrow(
        'Session does not exist',
      );
    });

    it('nominal case - should return the correct session if the session is found', async () => {
      const res = await sessionService.getSessionById(mockSessions[0]._id);
      expect(res).toEqual(mockSessions[0]);
    });
  });

  describe('updateSession', () => {
    it('nominal case - should update an existing session', async () => {
      const updatedSessionData = { ...mockSessions[0], userId: 'newUserId' };

      const res = await sessionService.updateSession(updatedSessionData);

      expect(res).toEqual(updatedSessionData);
    });

    it('functional error - should throw an error if the session does not exist', async () => {
      const invalidSessionData = { ...mockSessions[0], _id: 'invalidId' };
      const customMockSessionRepository = {
        getById: jest.fn(() => undefined),
      };
      const customSessionService = new SessionService(
        customMockSessionRepository,
      );

      await expect(
        customSessionService.updateSession(invalidSessionData),
      ).rejects.toThrow('Session does not exist');
    });
  });

  describe('deleteSessionById', () => {
    it('nominal case - should delete an existing session', async () => {
      const sessionIdToDelete = 'sessionToDeleteId';

      await sessionService.deleteSessionById(sessionIdToDelete);

      expect(mockSessionRepository.deleteById).toHaveBeenCalledWith(
        sessionIdToDelete,
      );
    });

    it('functional error - should throw an error if the session does not exist', async () => {
      const invalidSessionId = 'invalidSessionId';
      mockSessionRepository.getById.mockResolvedValue(undefined);

      await expect(
        sessionService.deleteSessionById(invalidSessionId),
      ).rejects.toThrow('Session does not exist');
    });
  });

  describe('startSession', () => {
    it('nominal case - should start a new session when user exists', async () => {
      const userId = 'userId';
      const dateDebut = '2024-04-20T10:30:00Z';

      // Mocking userService to return true, indicating user exists
      const mockUserService = {
        checkUserExists: jest.fn().mockResolvedValue(true),
      };

      // Creating a new session service with mocked repositories
      const sessionService = new SessionService(
        mockSessionRepository,
        mockUserService,
      );

      const res = await sessionService.startSession(userId, dateDebut);

      expect(res.userId).toBe(userId);
      expect(res.dateDebut.toISOString()).toBe(
        new Date(dateDebut).toISOString(),
      );
      expect(res.dateFin).toBeDefined();
      expect(res._id).toBeDefined();
    });

    it('should return an error if user does not exist', async () => {
      const userId = 'nonExistentUserId';
      const dateDebut = '2024-04-20T10:30:00Z';

      // Mocking userService to return false, indicating user does not exist
      const mockUserService = {
        checkUserExists: jest.fn().mockResolvedValue(false),
      };

      // Creating a new session service with mocked repositories
      const sessionService = new SessionService(
        mockSessionRepository,
        mockUserService,
      );

      await expect(
        sessionService.startSession(userId, dateDebut),
      ).rejects.toThrow('User not found');
    });

    it('should throw an error if user does not exist', async () => {
      const userId = 'nonExistentUserId';
      const dateDebut = '2024-04-20T10:30:00Z';

      // Mocking userService to return false, indicating user does not exist
      const mockUserService = {
        checkUserExists: jest.fn().mockResolvedValue(false),
      };

      // Creating a new session service with mocked repositories
      const sessionService = new SessionService(
        mockSessionRepository,
        mockUserService,
      );

      await expect(
        sessionService.startSession(userId, dateDebut),
      ).rejects.toThrow('User not found');
    });

    /*
    it('should throw an error if start date is invalid', async () => {
      const userId = 'userId';
      const invalidStartDate = 'toto';

      // Mocking userService to return true, indicating user exists
      const mockUserService = {
        checkUserExists: jest.fn().mockResolvedValue(true),
      };

      // Creating a new session service with mocked repositories
      const sessionService = new SessionService(
        mockSessionRepository,
        mockUserService,
      );

      await expect(
        sessionService.startSession(userId, invalidStartDate),
      ).rejects.toThrow('Invalid start date');
    });

    // Test pour vérifier si une erreur est levée lorsque la date de fin est antérieure à la date de début
    it('should throw an error if end date is before start date', async () => {
      const userId = 'userId';
      const pastEndDate = '2023-04-20T10:30:00Z';

      // Mocking userService to return true, indicating user exists
      const mockUserService = {
        checkUserExists: jest.fn().mockResolvedValue(true),
      };

      // Creating a new session service with mocked repositories
      const sessionService = new SessionService(
        mockSessionRepository,
        mockUserService,
      );

      await expect(
        sessionService.startSession(userId, pastEndDate),
      ).rejects.toThrow('End date is before start date');
    });

    it('should throw an error if another session is already in progress', async () => {
      const userId = 'userId';
      const dateDebut = '2024-04-20T10:30:00Z';

      // Mocking userService to return true, indicating user exists
      const mockUserService = {
        checkUserExists: jest.fn().mockResolvedValue(true),
      };

      // Mocking getSessionWithinRange to return a session already in progress
      const mockSessionRepository = {
        getSessionsWithinRange: jest.fn().mockResolvedValue([
          // Mocking a session already in progress
          {
            userId: userId,
            dateDebut: new Date('2024-04-20T10:00:00Z'), // Already in progress
            dateFin: new Date('2024-04-20T12:00:00Z'),
            duration: 7200000, // 2 hours
          },
        ]),
        // Mocking other methods if necessary
      };

      // Creating a new session service with mocked repositories
      const sessionService = new SessionService(
        mockSessionRepository,
        mockUserService,
      );

      await expect(
        sessionService.startSession(userId, dateDebut),
      ).rejects.toThrow('Another session is already in progress');
    });
    */

    describe('endSession', () => {
      it('functional error - should throw an error if the session does not exist', async () => {
        const invalidSessionId = 'invalidSessionId';
        const dateFin = '2024-04-20T12:30:00Z';

        // Mock une session inexistante dans la base de données
        const mockSessionRepository = {
          getById: jest.fn(() => undefined), // Retourne une session non définie (undefined)
          update: jest.fn(), // Mock de la méthode update
        };
        const customSessionService = new SessionService(mockSessionRepository);

        await expect(
          customSessionService.endSession(invalidSessionId, dateFin),
        ).rejects.toThrow('Session does not exist');

        // Vérifie que la méthode update n'a pas été appelée
        expect(mockSessionRepository.update).not.toHaveBeenCalled();
      });

      it('nominal case - should update an existing session', async () => {
        const sessionId = 'sessionId';
        const dateFin = '2024-04-20T12:30:00Z';
        const sessionToUpdate = {
          _id: sessionId,
          // Autres propriétés de session...
        };

        // Mock une session existante dans la base de données
        const mockSessionRepository = {
          getById: jest.fn(() => sessionToUpdate), // Retourne une session existante
          update: jest.fn(), // Mock de la méthode update
        };
        const customSessionService = new SessionService(mockSessionRepository);

        await customSessionService.endSession(sessionId, dateFin);

        // Vérifie que la méthode update a été appelée avec la session mise à jour
        expect(mockSessionRepository.update).toHaveBeenCalledWith({
          ...sessionToUpdate,
          dateFin: new Date(dateFin), // Crée une instance de Date à partir de la chaîne de date de fin
        });
      });
    });

    describe('addPauseToSession', () => {
      it('functional error - should throw an error if the session does not exist', async () => {
        const invalidSessionId = 'invalidSessionId';
        const debutPause = '2024-04-20T11:00:00Z';
        const finPause = '2024-04-20T11:30:00Z';

        // Mock une session inexistante dans la base de données
        const mockSessionRepository = {
          getById: jest.fn(() => undefined), // Retourne une session non définie (undefined)
          update: jest.fn(), // Mock de la méthode update
        };
        const customSessionService = new SessionService(mockSessionRepository);

        await expect(
          customSessionService.addPauseToSession(
            invalidSessionId,
            debutPause,
            finPause,
          ),
        ).rejects.toThrow('Session does not exist');

        // Vérifie que la méthode update n'a pas été appelée
        expect(mockSessionRepository.update).not.toHaveBeenCalled();
      });

      it('nominal case - should add a pause to an existing session', async () => {
        const sessionId = 'sessionId';
        const debutPause = '2024-04-20T11:00:00Z';
        const finPause = '2024-04-20T11:30:00Z';
        const sessionToUpdate = {
          _id: sessionId,
          pauses: [],
          // Autres propriétés de session...
        };

        // Mock une session existante dans la base de données
        const mockSessionRepository = {
          getById: jest.fn(() => sessionToUpdate), // Retourne une session existante
          update: jest.fn(), // Mock de la méthode update
        };
        const customSessionService = new SessionService(mockSessionRepository);

        await customSessionService.addPauseToSession(
          sessionId,
          debutPause,
          finPause,
        );

        // Vérifie que la méthode update a été appelée avec la session mise à jour
        expect(mockSessionRepository.update).toHaveBeenCalledWith(
          sessionToUpdate,
        );
        // Vérifie que la pause a été ajoutée à la session
        expect(sessionToUpdate.pauses).toEqual([
          { debutPause: new Date(debutPause), finPause: new Date(finPause) },
        ]);
      });
    });

    describe('calculateSessionMetrics', () => {
      it('nominal case - should calculate session metrics correctly', async () => {
        // Mock des fonctions appelées par calculateSessionMetrics
        sessionService.calculateAverageDuration = jest.fn(() => 7200000);
        sessionService.calculateMinDuration = jest.fn(() => 7200000);
        sessionService.calculateMaxDuration = jest.fn(() => 7200000);
        sessionService.calculateMedianDuration = jest.fn(() => 7200000);
        sessionService.calculateMaxGapBetweenPorts = jest.fn(() => 79200000);

        const metrics = await sessionService.calculateSessionMetrics('userId');

        const expectedMetrics = {
          averageDuration: 7200000,
          minDuration: 7200000,
          maxDuration: 7200000,
          medianDuration: 7200000,
          maxGapBetweenPorts: 79200000,
        };

        expect(metrics).toEqual(expectedMetrics);
      });
    });
  });
});
