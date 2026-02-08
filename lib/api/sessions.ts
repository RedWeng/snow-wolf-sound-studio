/**
 * Mock API functions for session management
 * Requirements: 2.1, 3.1, 4.1, 6.1
 */

import { Session } from '../types/database';
import { mockSessions } from '../mock-data/sessions';

/**
 * Simulates network latency with a random delay
 * @param min Minimum delay in milliseconds (default: 100)
 * @param max Maximum delay in milliseconds (default: 500)
 */
const simulateDelay = (min: number = 100, max: number = 500): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Get all sessions with optional filtering
 * @param filters Optional filters for status and date range
 * @returns Promise resolving to array of sessions
 */
export async function getSessions(filters?: {
  status?: Session['status'];
  dateFrom?: string;
  dateTo?: string;
}): Promise<Session[]> {
  await simulateDelay();

  let filteredSessions = [...mockSessions];

  // Filter by status
  if (filters?.status) {
    filteredSessions = filteredSessions.filter(
      (session) => session.status === filters.status
    );
  }

  // Filter by date range
  if (filters?.dateFrom) {
    filteredSessions = filteredSessions.filter(
      (session) => session.date >= filters.dateFrom!
    );
  }

  if (filters?.dateTo) {
    filteredSessions = filteredSessions.filter(
      (session) => session.date <= filters.dateTo!
    );
  }

  // Sort by date ascending
  filteredSessions.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return filteredSessions;
}

/**
 * Get a single session by ID
 * @param id Session ID
 * @returns Promise resolving to session or null if not found
 */
export async function getSessionById(id: string): Promise<Session | null> {
  await simulateDelay();

  const session = mockSessions.find((s) => s.id === id);
  return session || null;
}

/**
 * Get session availability information
 * @param sessionId Session ID
 * @returns Promise resolving to availability data
 */
export async function getSessionAvailability(sessionId: string): Promise<{
  capacity: number;
  registered: number;
  available: number;
  isWaitlistOnly: boolean;
}> {
  await simulateDelay();

  const session = mockSessions.find((s) => s.id === sessionId);

  if (!session) {
    throw new Error(`Session with ID ${sessionId} not found`);
  }

  // Mock registered count (random between 0 and capacity + hidden_buffer)
  // For demo purposes, we'll use a deterministic value based on session ID
  const registeredCount = parseInt(sessionId, 10) % (session.capacity + 2);

  const capacity = session.capacity;
  const registered = registeredCount;
  const available = Math.max(0, capacity - registered);
  const isWaitlistOnly = registered >= capacity;

  return {
    capacity,
    registered,
    available,
    isWaitlistOnly,
  };
}
