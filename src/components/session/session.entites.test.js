import { describe, expect, it } from '@jest/globals';
import Session from './session.entities';

describe('Session', () => {
  describe('calculateDuration', () => {
    it('should calculate the duration correctly', () => {
      const session = new Session(
        'userId',
        new Date('2024-04-20T10:00:00Z'),
        new Date('2024-04-20T12:00:00Z'),
        [],
      );

      const duration = session.calculateDuration();

      expect(duration).toBe(7200000);
    });
  });

  describe('calculatePauseDuration', () => {
    it('should calculate the pause duration correctly', () => {
      const session = new Session(
        'userId',
        new Date('2024-04-20T10:00:00Z'),
        new Date('2024-04-20T12:00:00Z'),
        [
          {
            debutPause: new Date('2024-04-20T10:30:00Z'),
            finPause: new Date('2024-04-20T11:00:00Z'),
          },
          {
            debutPause: new Date('2024-04-20T11:30:00Z'),
            finPause: new Date('2024-04-20T12:00:00Z'),
          },
        ],
      );

      const pauseDuration = session.calculatePauseDuration();

      expect(pauseDuration).toBe(3600000);
    });
  });

  describe('User Sessions', () => {
    const userSessions = [
      new Session(
        'userId',
        new Date('2024-04-15T08:30:00Z'),
        new Date('2024-04-15T21:30:00Z'),
      ),
      new Session(
        'userId',
        new Date('2024-04-16T07:45:00Z'),
        new Date('2024-04-16T22:00:00Z'),
        [
          {
            debutPause: new Date('2024-04-16T07:45:00Z'),
            finPause: new Date('2024-04-16T09:15:00Z'),
          },
        ],
      ),
      new Session(
        'userId',
        new Date('2024-04-17T09:00:00Z'),
        new Date('2024-04-17T22:15:00Z'),
        [
          {
            debutPause: new Date('2024-04-17T09:00:00Z'),
            finPause: new Date('2024-04-17T10:15:00Z'),
          },
        ],
      ),
      new Session(
        'userId',
        new Date('2024-04-18T08:00:00Z'),
        new Date('2024-04-18T22:00:00Z'),
      ),
      new Session(
        'userId',
        new Date('2024-04-19T07:30:00Z'),
        new Date('2024-04-19T22:30:00Z'),
        [
          {
            debutPause: new Date('2024-04-19T07:30:00Z'),
            finPause: new Date('2024-04-19T07:45:00Z'),
          },
        ],
      ),
      new Session(
        'userId',
        new Date('2024-04-20T10:00:00Z'),
        new Date('2024-04-20T23:55:00Z'),
        [
          {
            debutPause: new Date('2024-04-20T10:00:00Z'),
            finPause: new Date('2024-04-20T10:25:00Z'),
          },
        ],
      ),
      new Session(
        'userId',
        new Date('2024-04-21T08:45:00Z'),
        new Date('2024-04-21T23:45:00Z'),
      ),
    ];

    it('should have correct number of sessions', () => {
      expect(userSessions.length).toBe(7);
    });

    it('should have correct duration for each session', () => {
      const durations = userSessions.map((session) =>
        session.calculateDuration(),
      );
      const expectedDurations = [
        46800000, 45900000, 43200000, 50400000, 53100000, 48600000, 54000000,
      ];
      expect(durations).toEqual(expectedDurations);
    });

    it('should have correct pause duration for sessions with pauses', () => {
      const sessionWithPauses = userSessions.filter(
        (session) => session.pauses.length > 0,
      );
      const pauseDurations = sessionWithPauses.map((session) =>
        session.calculatePauseDuration(),
      );
      const expectedPauseDurations = [5400000, 4500000, 900000, 1500000];
      expect(pauseDurations).toEqual(expectedPauseDurations);
    });
  });
});
