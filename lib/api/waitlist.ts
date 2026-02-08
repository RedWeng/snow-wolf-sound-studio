/**
 * Waitlist API Functions
 * 
 * Handle waitlist operations for fully booked sessions
 */

import { mockSessions } from '@/lib/mock-data/sessions';

export interface WaitlistEntry {
  id: string;
  sessionId: string;
  sessionTitle: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  childId: string;
  childName: string;
  childAge: number;
  position: number;
  status: 'waiting' | 'promoted' | 'expired';
  createdAt: string;
  expiresAt: string;
}

/**
 * Add to waitlist
 */
export async function addToWaitlist(data: {
  sessionId: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  childId: string;
  childName: string;
  childAge: number;
}): Promise<{ success: boolean; entry?: WaitlistEntry; error?: string }> {
  try {
    const session = mockSessions.find(s => s.id === data.sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    // Check if session is actually full
    const remaining = session.capacity - (session.current_registrations || 0);
    if (remaining > 0) {
      return { success: false, error: 'Session still has available spots' };
    }

    // Check if already on waitlist (in production, query database)
    // For now, just create entry
    const position = 1; // In production, this would be calculated from database
    
    // Waitlist expires after 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const entry: WaitlistEntry = {
      id: `waitlist-${Date.now()}`,
      sessionId: data.sessionId,
      sessionTitle: session.title_zh,
      parentId: data.parentId,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      childId: data.childId,
      childName: data.childName,
      childAge: data.childAge,
      position,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // TODO: Save to database
    console.log('📋 [MOCK] Waitlist entry would be saved:', entry);

    // In production, update session waitlist count in database
    // For now, just log it
    console.log('📋 [MOCK] Session waitlist count would be incremented');

    return { success: true, entry };
  } catch (error) {
    console.error('Failed to add to waitlist:', error);
    return { success: false, error: 'Failed to add to waitlist' };
  }
}

/**
 * Remove from waitlist
 */
export async function removeFromWaitlist(
  entryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Delete from database
    console.log('🗑️ [MOCK] Waitlist entry would be removed:', entryId);
    return { success: true };
  } catch (error) {
    console.error('Failed to remove from waitlist:', error);
    return { success: false, error: 'Failed to remove from waitlist' };
  }
}

/**
 * Promote from waitlist (when spot becomes available)
 */
export async function promoteFromWaitlist(
  entryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Update status in database
    // TODO: Send notification email to parent
    console.log('⬆️ [MOCK] Waitlist entry would be promoted:', entryId);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 [DEV] Promotion email would be sent to parent');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to promote from waitlist:', error);
    return { success: false, error: 'Failed to promote from waitlist' };
  }
}

/**
 * Get waitlist entries for a session
 */
export async function getWaitlistForSession(
  sessionId: string
): Promise<{ success: boolean; entries?: WaitlistEntry[]; error?: string }> {
  try {
    // TODO: Query from database
    console.log('🔍 [MOCK] Fetching waitlist for session:', sessionId);
    return { success: true, entries: [] };
  } catch (error) {
    console.error('Failed to get waitlist:', error);
    return { success: false, error: 'Failed to get waitlist' };
  }
}

/**
 * Get waitlist entries for a parent
 */
export async function getWaitlistForParent(
  parentId: string
): Promise<{ success: boolean; entries?: WaitlistEntry[]; error?: string }> {
  try {
    // TODO: Query from database
    console.log('🔍 [MOCK] Fetching waitlist for parent:', parentId);
    return { success: true, entries: [] };
  } catch (error) {
    console.error('Failed to get waitlist:', error);
    return { success: false, error: 'Failed to get waitlist' };
  }
}
