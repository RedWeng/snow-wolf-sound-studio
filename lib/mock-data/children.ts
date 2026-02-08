import { Child } from '../types/database';

/**
 * Mock children data
 * Requirements: 3.2, 6.1
 */
export const mockChildren: Child[] = [
  {
    id: 'child-1',
    parent_id: 'user-1',
    name: '小明',
    age: 8,
    notes: '喜歡冒險故事和動畫配音',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'child-2',
    parent_id: 'user-1',
    name: '小華',
    age: 6,
    notes: '對舞蹈和肢體表演很有興趣',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'child-3',
    parent_id: 'user-2',
    name: 'Emma',
    age: 10,
    notes: 'Loves RPG games and voice acting',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'child-4',
    parent_id: 'user-2',
    name: 'Lucas',
    age: 7,
    notes: 'Enjoys animation and creative storytelling',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'child-5',
    parent_id: 'user-3',
    name: '小芳',
    age: 9,
    notes: '喜歡唱歌和錄音',
    created_at: new Date('2024-01-25').toISOString(),
    updated_at: new Date('2024-01-25').toISOString(),
  },
];
