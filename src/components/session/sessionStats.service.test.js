import Session from './session.entities.js';
import { describe, expect, it, jest } from '@jest/globals';
import SessionService from './session.service.js';

describe('SessionService methods', () => {
  let sessionService;
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

  beforeEach(() => {
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
    };
    sessionService = new SessionService(mockSessionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate average duration correctly', async () => {
    const average = await sessionService.calculateAverageDuration(mockSessions);
    expect(average).toBe(7200000); // Assuming each session duration is 2 hours
  });

  it('should calculate min duration correctly', async () => {
    const minDuration = await sessionService.calculateMinDuration(mockSessions);
    expect(minDuration).toBe(7200000); // Assuming min duration is 2 hours
  });

  it('should calculate max duration correctly', async () => {
    const maxDuration = await sessionService.calculateMaxDuration(mockSessions);
    expect(maxDuration).toBe(7200000); // Assuming max duration is 2 hours
  });

  it('should calculate median duration correctly', async () => {
    const medianDuration = await sessionService.calculateMedianDuration(
      mockSessions,
    );
    expect(medianDuration).toBe(7200000); // Assuming median duration is 2 hours
  });

  it('should calculate max gap between ports correctly', async () => {
    const maxGap = await sessionService.calculateMaxGapBetweenPorts(
      mockSessions,
    );
    expect(maxGap).toBe(79200000); // Assuming max gap is 1 day in milliseconds
  });

  it('should return 0 for empty sessions array', async () => {
    const average = await sessionService.calculateAverageDuration(
      mockSessionsVide,
    );
    const minDuration = await sessionService.calculateMinDuration(
      mockSessionsVide,
    );
    const maxDuration = await sessionService.calculateMaxDuration(
      mockSessionsVide,
    );
    const medianDuration = await sessionService.calculateMedianDuration(
      mockSessionsVide,
    );
    const maxGap = await sessionService.calculateMaxGapBetweenPorts(
      mockSessionsVide,
    );

    expect(average).toBe(0);
    expect(minDuration).toBe(0);
    expect(maxDuration).toBe(0);
    expect(medianDuration).toBe(0);
    expect(maxGap).toBe(0);
  });
});
