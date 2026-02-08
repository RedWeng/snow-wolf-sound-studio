import { User, Child } from '../types/database';

/**
 * Mock user profiles (parents and admins)
 * Requirements: 2.1, 3.2, 6.1
 */
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'parent1@example.com',
    full_name: '王小明',
    phone: '+886912345678',
    language_preference: 'zh',
    role: 'parent',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'user-2',
    email: 'parent2@example.com',
    full_name: '李美華',
    phone: '+886923456789',
    language_preference: 'zh',
    role: 'parent',
    created_at: new Date('2024-01-18').toISOString(),
    updated_at: new Date('2024-01-18').toISOString(),
  },
  {
    id: 'user-3',
    email: 'parent3@example.com',
    full_name: 'John Smith',
    phone: '+886934567890',
    language_preference: 'en',
    role: 'parent',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'user-4',
    email: 'parent4@example.com',
    full_name: '陳雅婷',
    phone: '+886945678901',
    language_preference: 'zh',
    role: 'parent',
    created_at: new Date('2024-01-22').toISOString(),
    updated_at: new Date('2024-01-22').toISOString(),
  },
  {
    id: 'user-5',
    email: 'parent5@example.com',
    full_name: 'Sarah Johnson',
    phone: '+886956789012',
    language_preference: 'en',
    role: 'parent',
    created_at: new Date('2024-01-25').toISOString(),
    updated_at: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'admin-1',
    email: 'owner@snowwolfboy.com',
    full_name: '張經理',
    phone: '+886987654321',
    language_preference: 'zh',
    role: 'owner',
    created_at: new Date('2023-12-01').toISOString(),
    updated_at: new Date('2023-12-01').toISOString(),
  },

  {
    id: 'admin-2',
    email: 'assistant@snowwolfboy.com',
    full_name: '林助理',
    phone: '+886976543210',
    language_preference: 'zh',
    role: 'assistant',
    created_at: new Date('2023-12-15').toISOString(),
    updated_at: new Date('2023-12-15').toISOString(),
  },
  {
    id: 'admin-3',
    email: 'teacher@snowwolfboy.com',
    full_name: '黃老師',
    phone: '+886965432109',
    language_preference: 'zh',
    role: 'teacher',
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
];

/**
 * Mock children data (1-4 per parent)
 * Requirements: 3.2
 */
export const mockChildren: Child[] = [
  // Parent 1 children
  {
    id: 'child-1',
    parent_id: 'user-1',
    name: '王小華',
    age: 8,
    notes: '喜歡音樂和舞蹈',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'child-2',
    parent_id: 'user-1',
    name: '王小美',
    age: 6,
    notes: '對攝影很有興趣',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  // Parent 2 children
  {
    id: 'child-3',
    parent_id: 'user-2',
    name: '李小龍',
    age: 10,
    notes: '活潑好動，喜歡戶外活動',
    created_at: new Date('2024-01-18').toISOString(),
    updated_at: new Date('2024-01-18').toISOString(),
  },
  {
    id: 'child-4',
    parent_id: 'user-2',
    name: '李小鳳',
    age: 7,
    notes: '安靜內向，喜歡閱讀',
    created_at: new Date('2024-01-18').toISOString(),
    updated_at: new Date('2024-01-18').toISOString(),
  },
  {
    id: 'child-5',
    parent_id: 'user-2',
    name: '李小虎',
    age: 5,
    notes: null,
    created_at: new Date('2024-01-18').toISOString(),
    updated_at: new Date('2024-01-18').toISOString(),
  },
  // Parent 3 children
  {
    id: 'child-6',
    parent_id: 'user-3',
    name: 'Emma Smith',
    age: 9,
    notes: 'Loves drama and storytelling',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
  },
  // Parent 4 children
  {
    id: 'child-7',
    parent_id: 'user-4',
    name: '陳小明',
    age: 11,
    notes: '對科技和錄音有興趣',
    created_at: new Date('2024-01-22').toISOString(),
    updated_at: new Date('2024-01-22').toISOString(),
  },
  {
    id: 'child-8',
    parent_id: 'user-4',
    name: '陳小芳',
    age: 8,
    notes: '喜歡唱歌和表演',
    created_at: new Date('2024-01-22').toISOString(),
    updated_at: new Date('2024-01-22').toISOString(),
  },
  {
    id: 'child-9',
    parent_id: 'user-4',
    name: '陳小強',
    age: 6,
    notes: null,
    created_at: new Date('2024-01-22').toISOString(),
    updated_at: new Date('2024-01-22').toISOString(),
  },
  {
    id: 'child-10',
    parent_id: 'user-4',
    name: '陳小玲',
    age: 4,
    notes: '最小的孩子，需要特別照顧',
    created_at: new Date('2024-01-22').toISOString(),
    updated_at: new Date('2024-01-22').toISOString(),
  },
  // Parent 5 children
  {
    id: 'child-11',
    parent_id: 'user-5',
    name: 'Oliver Johnson',
    age: 7,
    notes: 'Enjoys music and photography',
    created_at: new Date('2024-01-25').toISOString(),
    updated_at: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'child-12',
    parent_id: 'user-5',
    name: 'Sophia Johnson',
    age: 5,
    notes: 'Very creative and imaginative',
    created_at: new Date('2024-01-25').toISOString(),
    updated_at: new Date('2024-01-25').toISOString(),
  },
];
