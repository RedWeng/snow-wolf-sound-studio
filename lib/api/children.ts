/**
 * Mock API functions for children management
 * Requirements: 3.1, 3.2
 */

import { Child } from '../types/database';
import { mockChildren } from '../mock-data/users';

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
 * Get all children for a parent
 * @param parentId Parent user ID
 * @returns Promise resolving to array of children
 */
export async function getChildren(parentId: string): Promise<Child[]> {
  await simulateDelay();

  const children = mockChildren.filter((child) => child.parent_id === parentId);

  // Sort by age descending (oldest first)
  children.sort((a, b) => b.age - a.age);

  return children;
}

/**
 * Create a new child for a parent
 * @param data Child creation data
 * @returns Promise resolving to created child
 */
export async function createChild(data: {
  parentId: string;
  name: string;
  age: number;
  notes?: string;
}): Promise<Child> {
  await simulateDelay(200, 600);

  // Validate maximum 4 children per parent
  const existingChildren = mockChildren.filter(
    (child) => child.parent_id === data.parentId
  );

  if (existingChildren.length >= 4) {
    throw new Error('Maximum 4 children per parent');
  }

  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    throw new Error('Child name is required');
  }

  if (data.age === undefined || data.age === null) {
    throw new Error('Child age is required');
  }

  if (data.age < 0 || data.age > 18) {
    throw new Error('Child age must be between 0 and 18');
  }

  // Create new child
  const newChild: Child = {
    id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    parent_id: data.parentId,
    name: data.name.trim(),
    age: data.age,
    notes: data.notes?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // In a real implementation, this would be saved to the database
  // For mock purposes, we'll just return the created child
  return newChild;
}

/**
 * Update an existing child
 * @param id Child ID
 * @param data Partial child data to update
 * @returns Promise resolving to updated child
 */
export async function updateChild(
  id: string,
  data: Partial<Pick<Child, 'name' | 'age' | 'notes'>>
): Promise<Child> {
  await simulateDelay(200, 600);

  const child = mockChildren.find((c) => c.id === id);

  if (!child) {
    throw new Error(`Child with ID ${id} not found`);
  }

  // Validate fields if provided
  if (data.name !== undefined && data.name.trim() === '') {
    throw new Error('Child name cannot be empty');
  }

  if (data.age !== undefined && (data.age < 0 || data.age > 18)) {
    throw new Error('Child age must be between 0 and 18');
  }

  // Create updated child
  const updatedChild: Child = {
    ...child,
    name: data.name?.trim() ?? child.name,
    age: data.age ?? child.age,
    notes: data.notes !== undefined ? (data.notes?.trim() || null) : child.notes,
    updated_at: new Date().toISOString(),
  };

  return updatedChild;
}

/**
 * Delete a child
 * @param id Child ID
 * @returns Promise resolving when deletion is complete
 */
export async function deleteChild(id: string): Promise<void> {
  await simulateDelay(200, 600);

  const child = mockChildren.find((c) => c.id === id);

  if (!child) {
    throw new Error(`Child with ID ${id} not found`);
  }

  // In a real implementation, this would check for confirmed registrations
  // and prevent deletion if any exist
  // For mock purposes, we'll just simulate the deletion
}
