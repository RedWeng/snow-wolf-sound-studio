/**
 * Unit tests for session API functions
 * Requirements: 2.1, 3.1
 */

import { getSessions, getSessionById, getSessionAvailability } from '@/lib/api/sessions';
import { mockSessions } from '@/lib/mock-data/sessions';

describe('Session API', () => {
  describe('getSessions', () => {
    it('should return all sessions when no filters are provided', async () => {
      const sessions = await getSessions();
      expect(sessions).toHaveLength(mockSessions.length);
      expect(sessions).toEqual(expect.arrayContaining(mockSessions));
    });

    it('should filter sessions by status', async () => {
      const activeSessions = await getSessions({ status: 'active' });
      expect(activeSessions.every((s) => s.status === 'active')).toBe(true);
    });

    it('should filter sessions by date range (from)', async () => {
      const dateFrom = '2024-02-20';
      const sessions = await getSessions({ dateFrom });
      expect(sessions.every((s) => s.date >= dateFrom)).toBe(true);
    });

    it('should filter sessions by date range (to)', async () => {
      const dateTo = '2024-02-20';
      const sessions = await getSessions({ dateTo });
      expect(sessions.every((s) => s.date <= dateTo)).toBe(true);
    });

    it('should filter sessions by date range (from and to)', async () => {
      const dateFrom = '2024-02-18';
      const dateTo = '2024-02-25';
      const sessions = await getSessions({ dateFrom, dateTo });
      expect(
        sessions.every((s) => s.date >= dateFrom && s.date <= dateTo)
      ).toBe(true);
    });

    it('should sort sessions by date ascending', async () => {
      const sessions = await getSessions();
      for (let i = 1; i < sessions.length; i++) {
        const prevDate = new Date(`${sessions[i - 1].date}T${sessions[i - 1].time}`);
        const currDate = new Date(`${sessions[i].date}T${sessions[i].time}`);
        expect(currDate.getTime()).toBeGreaterThanOrEqual(prevDate.getTime());
      }
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await getSessions();
      const endTime = Date.now();
      const duration = endTime - startTime;
      // Should take at least 100ms (minimum delay)
      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });

  describe('getSessionById', () => {
    it('should return session when ID exists', async () => {
      const session = await getSessionById('1');
      expect(session).not.toBeNull();
      expect(session?.id).toBe('1');
    });

    it('should return null when ID does not exist', async () => {
      const session = await getSessionById('non-existent-id');
      expect(session).toBeNull();
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await getSessionById('1');
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });

  describe('getSessionAvailability', () => {
    it('should return availability data for existing session', async () => {
      const availability = await getSessionAvailability('1');
      expect(availability).toHaveProperty('capacity');
      expect(availability).toHaveProperty('registered');
      expect(availability).toHaveProperty('available');
      expect(availability).toHaveProperty('isWaitlistOnly');
      expect(typeof availability.capacity).toBe('number');
      expect(typeof availability.registered).toBe('number');
      expect(typeof availability.available).toBe('number');
      expect(typeof availability.isWaitlistOnly).toBe('boolean');
    });

    it('should calculate available seats correctly', async () => {
      const availability = await getSessionAvailability('1');
      const expectedAvailable = Math.max(
        0,
        availability.capacity - availability.registered
      );
      expect(availability.available).toBe(expectedAvailable);
    });

    it('should set isWaitlistOnly to true when session is full', async () => {
      const availability = await getSessionAvailability('1');
      if (availability.registered >= availability.capacity) {
        expect(availability.isWaitlistOnly).toBe(true);
      }
    });

    it('should set isWaitlistOnly to false when seats are available', async () => {
      const availability = await getSessionAvailability('1');
      if (availability.registered < availability.capacity) {
        expect(availability.isWaitlistOnly).toBe(false);
      }
    });

    it('should throw error for non-existent session', async () => {
      await expect(
        getSessionAvailability('non-existent-id')
      ).rejects.toThrow('Session with ID non-existent-id not found');
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await getSessionAvailability('1');
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });
});
