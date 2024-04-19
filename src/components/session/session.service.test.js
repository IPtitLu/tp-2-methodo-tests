import Session from './session.entities';
import { describe, expect, it, jest } from '@jest/globals';
import SessionService from "./session.service.js";
import { DateTime } from 'luxon';

describe('SessionService', () => {

    const mockSessions = [
        new Session("userId1", new Date("2024-04-15T10:30:00Z"), new Date("2024-04-15T12:30:00Z"), []),
        new Session("userId2", new Date("2024-04-16T10:30:00Z"), new Date("2024-04-16T12:30:00Z"), []),
        new Session("userId3", new Date("2024-04-17T10:30:00Z"), new Date("2024-04-17T12:30:00Z"), []),
        new Session("userId4", new Date("2024-04-18T10:30:00Z"), new Date("2024-04-18T12:30:00Z"), [])
    ];

    const mockSessionRepository = {
        getById: jest.fn((id) => mockSessions[0]),
        getAll: jest.fn(() => mockSessions),
        deleteById: jest.fn((id) => undefined),
        deleteAll: jest.fn(() => undefined),
        create: jest.fn((session) => new Session(session.userId, session.dateDebut, session.dateFin, [])),
        update: jest.fn((session) => session),
    };

    const sessionService = new SessionService(mockSessionRepository);

    describe('addSession', () => {
        it('nominal case - should add a new session to the sessions array', async () => {
            // GIVEN
            const sessionData = new Session("userId5", new Date("2024-04-19T10:30:00Z"), new Date("2024-04-19T12:30:00Z"), []);

            // WHEN
            const res = await sessionService.addSession(sessionData);

            // THEN
            expect(res.userId).toBe(sessionData.userId);
            expect(res.dateDebut).toBe(sessionData.dateDebut);
            expect(res.dateFin).toBe(sessionData.dateFin);
            expect(res._id).toBeDefined();
        });
    });

    describe('getSessions', () => {
        it('nominal case - should return an array of all sessions in the database', () => {
            expect(sessionService.getSessions().length).toEqual(4);
        });
    });

    describe('getSessionById', () => {
        it('functional error - should throw an error if the session is not found', async () => {
            // GIVEN
            const customMockSessionRepository = {
                getById: jest.fn(() => undefined)
            }
            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN - THEN
            await expect(customSessionService.getSessionById("0")).rejects.toThrow('Session does not exist');
        });

        it('nominal case - should return the correct session if the session is found', async () => {
            const res = await sessionService.getSessionById(mockSessions[0]._id);
            expect(res).toEqual(mockSessions[0]);
        });
    });

    describe('updateSession', () => {
        it('nominal case - should update an existing session', async () => {
            // GIVEN
            const updatedSessionData = { ...mockSessions[0], userId: "newUserId" };

            // WHEN
            const res = await sessionService.updateSession(updatedSessionData);

            // THEN
            expect(res).toEqual(updatedSessionData);
        });

        it('functional error - should throw an error if the session does not exist', async () => {
            // GIVEN
            const invalidSessionData = { ...mockSessions[0], _id: "invalidId" };
            const customMockSessionRepository = {
                getById: jest.fn(() => undefined)
            };
            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN - THEN
            await expect(customSessionService.updateSession(invalidSessionData)).rejects.toThrow('Session does not exist');
        });
    });

    describe('deleteSessionById', () => {
        it('nominal case - should delete an existing session', async () => {
            // GIVEN
            const sessionIdToDelete = "sessionToDeleteId";

            // WHEN
            await sessionService.deleteSessionById(sessionIdToDelete);

            // THEN
            expect(mockSessionRepository.deleteById).toHaveBeenCalledWith(sessionIdToDelete);
        });

        it('functional error - should throw an error if the session does not exist', async () => {
            // GIVEN
            const invalidSessionId = "invalidSessionId";
            mockSessionRepository.getById.mockResolvedValue(undefined);

            // WHEN - THEN
            await expect(sessionService.deleteSessionById(invalidSessionId)).rejects.toThrow('Session does not exist');
        });
    });

    describe('startSession', () => {
        it('nominal case - should start a new session', async () => {
            // GIVEN
            const userId = "userId";
            const dateDebut = "2024-04-20T10:30:00Z";

            // WHEN
            const res = await sessionService.startSession(userId, dateDebut);

            // THEN
            expect(res.userId).toBe(userId);
            expect(res.dateDebut.toISOString()).toBe(new Date(dateDebut).toISOString());
            expect(res.dateFin).toBe(undefined);
            expect(res._id).toBeDefined();
        });
    });

    describe('endSession', () => {
        it('functional error - should throw an error if the session does not exist', async () => {
            // GIVEN
            const invalidSessionId = "invalidSessionId";
            const dateFin = "2024-04-20T12:30:00Z";

            // Mock une session inexistante dans la base de données
            const mockSessionRepository = {
                getById: jest.fn(() => undefined), // Retourne une session non définie (undefined)
                update: jest.fn() // Mock de la méthode update
            };
            const customSessionService = new SessionService(mockSessionRepository);

            // WHEN - THEN
            await expect(customSessionService.endSession(invalidSessionId, dateFin)).rejects.toThrow('Session does not exist');

            // Vérifie que la méthode update n'a pas été appelée
            expect(mockSessionRepository.update).not.toHaveBeenCalled();
        });

        it('nominal case - should update an existing session', async () => {
            // GIVEN
            const sessionId = "sessionId";
            const dateFin = "2024-04-20T12:30:00Z";
            const sessionToUpdate = {
                _id: sessionId,
                // Autres propriétés de session...
            };

            // Mock une session existante dans la base de données
            const mockSessionRepository = {
                getById: jest.fn(() => sessionToUpdate), // Retourne une session existante
                update: jest.fn() // Mock de la méthode update
            };
            const customSessionService = new SessionService(mockSessionRepository);

            // WHEN
            await customSessionService.endSession(sessionId, dateFin);

            // THEN
            // Vérifie que la méthode update a été appelée avec la session mise à jour
            expect(mockSessionRepository.update).toHaveBeenCalledWith(sessionToUpdate);
        });
    });

    describe('addPauseToSession', () => {
        it('functional error - should throw an error if the session does not exist', async () => {
            // GIVEN
            const invalidSessionId = "invalidSessionId";
            const debutPause = "2024-04-20T11:00:00Z";
            const finPause = "2024-04-20T11:30:00Z";

            // Mock une session inexistante dans la base de données
            const mockSessionRepository = {
                getById: jest.fn(() => undefined), // Retourne une session non définie (undefined)
                update: jest.fn() // Mock de la méthode update
            };
            const customSessionService = new SessionService(mockSessionRepository);

            // WHEN - THEN
            await expect(customSessionService.addPauseToSession(invalidSessionId, debutPause, finPause)).rejects.toThrow('Session does not exist');

            // Vérifie que la méthode update n'a pas été appelée
            expect(mockSessionRepository.update).not.toHaveBeenCalled();
        });

        it('nominal case - should add a pause to an existing session', async () => {
            // GIVEN
            const sessionId = "sessionId";
            const debutPause = "2024-04-20T11:00:00Z";
            const finPause = "2024-04-20T11:30:00Z";
            const sessionToUpdate = {
                _id: sessionId,
                pauses: []
                // Autres propriétés de session...
            };

            // Mock une session existante dans la base de données
            const mockSessionRepository = {
                getById: jest.fn(() => sessionToUpdate), // Retourne une session existante
                update: jest.fn() // Mock de la méthode update
            };
            const customSessionService = new SessionService(mockSessionRepository);

            // WHEN
            await customSessionService.addPauseToSession(sessionId, debutPause, finPause);

            // THEN
            // Vérifie que la méthode update a été appelée avec la session mise à jour
            expect(mockSessionRepository.update).toHaveBeenCalledWith(sessionToUpdate);
            // Vérifie que la pause a été ajoutée à la session
            expect(sessionToUpdate.pauses).toEqual([{ debutPause: new Date(debutPause), finPause: new Date(finPause) }]);
        });
    });
});
