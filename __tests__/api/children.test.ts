/**
 * Unit tests for children API functions
 * Requirements: 3.1, 3.2
 */

import { getChildren, createChild, updateChild, deleteChild } from '@/lib/api/children';
import { mockChildren } from '@/lib/mock-data/users';

describe('Children API', () => {
  describe('getChildren', () => {
    it('should return all children for a parent', async () => {
      const children = await getChildren('user-1');
      expect(children.length).toBeGreaterThan(0);
      expect(children.every((c) => c.parent_id === 'user-1')).toBe(true);
    });

    it('should return empty array for parent with no children', async () => {
      const children = await getChildren('non-existent-parent');
      expect(children).toEqual([]);
    });

    it('should sort children by age descending', async () => {
      const children = await getChildren('user-2');
      if (children.length > 1) {
        for (let i = 1; i < children.length; i++) {
          expect(children[i - 1].age).toBeGreaterThanOrEqual(children[i].age);
        }
      }
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await getChildren('user-1');
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });

  describe('createChild', () => {
    it('should create a new child with valid data', async () => {
      const childData = {
        parentId: 'user-3',
        name: 'Test Child',
        age: 7,
        notes: 'Test notes',
      };

      const child = await createChild(childData);
      expect(child).toHaveProperty('id');
      expect(child.parent_id).toBe(childData.parentId);
      expect(child.name).toBe(childData.name);
      expect(child.age).toBe(childData.age);
      expect(child.notes).toBe(childData.notes);
      expect(child).toHaveProperty('created_at');
      expect(child).toHaveProperty('updated_at');
    });

    it('should create a child without notes', async () => {
      const childData = {
        parentId: 'user-3',
        name: 'Test Child',
        age: 7,
      };

      const child = await createChild(childData);
      expect(child.notes).toBeNull();
    });

    it('should trim whitespace from name and notes', async () => {
      const childData = {
        parentId: 'user-3',
        name: '  Test Child  ',
        age: 7,
        notes: '  Test notes  ',
      };

      const child = await createChild(childData);
      expect(child.name).toBe('Test Child');
      expect(child.notes).toBe('Test notes');
    });

    it('should throw error when parent has 4 children', async () => {
      const childData = {
        parentId: 'user-4', // This parent already has 4 children
        name: 'Fifth Child',
        age: 5,
      };

      await expect(createChild(childData)).rejects.toThrow(
        'Maximum 4 children per parent'
      );
    });

    it('should throw error when name is empty', async () => {
      const childData = {
        parentId: 'user-3',
        name: '',
        age: 7,
      };

      await expect(createChild(childData)).rejects.toThrow(
        'Child name is required'
      );
    });

    it('should throw error when name is only whitespace', async () => {
      const childData = {
        parentId: 'user-3',
        name: '   ',
        age: 7,
      };

      await expect(createChild(childData)).rejects.toThrow(
        'Child name is required'
      );
    });

    it('should throw error when age is missing', async () => {
      const childData = {
        parentId: 'user-3',
        name: 'Test Child',
        age: undefined as any,
      };

      await expect(createChild(childData)).rejects.toThrow(
        'Child age is required'
      );
    });

    it('should throw error when age is negative', async () => {
      const childData = {
        parentId: 'user-3',
        name: 'Test Child',
        age: -1,
      };

      await expect(createChild(childData)).rejects.toThrow(
        'Child age must be between 0 and 18'
      );
    });

    it('should throw error when age is greater than 18', async () => {
      const childData = {
        parentId: 'user-3',
        name: 'Test Child',
        age: 19,
      };

      await expect(createChild(childData)).rejects.toThrow(
        'Child age must be between 0 and 18'
      );
    });

    it('should accept age 0', async () => {
      const childData = {
        parentId: 'user-3',
        name: 'Baby',
        age: 0,
      };

      const child = await createChild(childData);
      expect(child.age).toBe(0);
    });

    it('should accept age 18', async () => {
      const childData = {
        parentId: 'user-3',
        name: 'Teen',
        age: 18,
      };

      const child = await createChild(childData);
      expect(child.age).toBe(18);
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await createChild({
        parentId: 'user-3',
        name: 'Test Child',
        age: 7,
      });
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(200);
    });
  });

  describe('updateChild', () => {
    it('should update child name', async () => {
      const updatedChild = await updateChild('child-1', {
        name: 'Updated Name',
      });
      expect(updatedChild.name).toBe('Updated Name');
    });

    it('should update child age', async () => {
      const updatedChild = await updateChild('child-1', {
        age: 10,
      });
      expect(updatedChild.age).toBe(10);
    });

    it('should update child notes', async () => {
      const updatedChild = await updateChild('child-1', {
        notes: 'Updated notes',
      });
      expect(updatedChild.notes).toBe('Updated notes');
    });

    it('should update multiple fields', async () => {
      const updatedChild = await updateChild('child-1', {
        name: 'New Name',
        age: 9,
        notes: 'New notes',
      });
      expect(updatedChild.name).toBe('New Name');
      expect(updatedChild.age).toBe(9);
      expect(updatedChild.notes).toBe('New notes');
    });

    it('should trim whitespace from name and notes', async () => {
      const updatedChild = await updateChild('child-1', {
        name: '  Trimmed Name  ',
        notes: '  Trimmed notes  ',
      });
      expect(updatedChild.name).toBe('Trimmed Name');
      expect(updatedChild.notes).toBe('Trimmed notes');
    });

    it('should set notes to null when empty string is provided', async () => {
      const updatedChild = await updateChild('child-1', {
        notes: '',
      });
      expect(updatedChild.notes).toBeNull();
    });

    it('should throw error for non-existent child', async () => {
      await expect(
        updateChild('non-existent-id', { name: 'Test' })
      ).rejects.toThrow('Child with ID non-existent-id not found');
    });

    it('should throw error when name is empty', async () => {
      await expect(
        updateChild('child-1', { name: '' })
      ).rejects.toThrow('Child name cannot be empty');
    });

    it('should throw error when age is invalid', async () => {
      await expect(
        updateChild('child-1', { age: -1 })
      ).rejects.toThrow('Child age must be between 0 and 18');

      await expect(
        updateChild('child-1', { age: 19 })
      ).rejects.toThrow('Child age must be between 0 and 18');
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await updateChild('child-1', { name: 'Test' });
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(200);
    });
  });

  describe('deleteChild', () => {
    it('should delete existing child', async () => {
      await expect(deleteChild('child-1')).resolves.not.toThrow();
    });

    it('should throw error for non-existent child', async () => {
      await expect(deleteChild('non-existent-id')).rejects.toThrow(
        'Child with ID non-existent-id not found'
      );
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await deleteChild('child-1');
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(200);
    });
  });
});
