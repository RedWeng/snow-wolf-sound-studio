/**
 * Character role configurations for sessions
 * This file defines character roles that can be assigned to sessions
 */

import { CharacterRole } from '@/lib/types/database';

/**
 * Battle of Kadal (卡達爾之戰) character roles
 * 6 characters from the Snow Wolf Boy series
 */
export const battleOfKadalRoles: CharacterRole[] = [
  {
    id: 'aileen',
    name_zh: '艾琳',
    name_en: 'Aileen',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546764/snow-wolf/full/b8uumtjswv0w7pnm3mhy.png',
    capacity: 4,
  },
  {
    id: 'litt',
    name_zh: '里特',
    name_en: 'Litt',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546797/snow-wolf/full/yxz4hdhmgacu1by6o17v.png',
    capacity: 4,
  },
  {
    id: 'kadar',
    name_zh: '卡達爾',
    name_en: 'Kadar',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546796/snow-wolf/full/zg3thag4y6nruriucob4.png',
    capacity: 4,
  },
  {
    id: 'fia',
    name_zh: '菲亞',
    name_en: 'Fia',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546781/snow-wolf/full/tuhg6allkxuy9simpyrk.png',
    capacity: 4,
  },
  {
    id: 'aina',
    name_zh: '艾娜',
    name_en: 'Aina',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546768/snow-wolf/full/oa8fzjxtgg1sb2zaqkhr.png',
    capacity: 4,
  },
  {
    id: 'erwin',
    name_zh: '艾爾文老師',
    name_en: 'Teacher Erwin',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546778/snow-wolf/full/hqwdwacymctfcailxfej.png',
    capacity: 4,
  },
];

/**
 * Classic Snow Wolf Foley Session (雪狼經典場 × 擬音錄音) character roles
 * 5 main child characters from the original story
 */
export const classicSnowWolfRoles: CharacterRole[] = [
  {
    id: 'litt',
    name_zh: '里特',
    name_en: 'Litt',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546797/snow-wolf/full/yxz4hdhmgacu1by6o17v.png',
    capacity: 3,
    description_zh: '雪狼男孩主角，勇敢且充滿正義感',
    description_en: 'Snow Wolf Boy protagonist, brave and full of justice',
  },
  {
    id: 'dean',
    name_zh: '迪恩',
    name_en: 'Dean',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546773/snow-wolf/full/vdkueljveri74ujdtegf.png',
    capacity: 3,
    description_zh: '里特的好友，聰明機智',
    description_en: 'Litt\'s friend, smart and witty',
  },
  {
    id: 'heather',
    name_zh: '海瑟',
    name_en: 'Heather',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546786/snow-wolf/full/tgjycv1u7exzhtcw4zt2.png',
    capacity: 3,
    description_zh: '溫柔善良的女孩',
    description_en: 'Gentle and kind girl',
  },
  {
    id: 'aileen',
    name_zh: '艾琳',
    name_en: 'Aileen',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546764/snow-wolf/full/b8uumtjswv0w7pnm3mhy.png',
    capacity: 3,
    description_zh: '活潑開朗的女孩',
    description_en: 'Lively and cheerful girl',
  },
  {
    id: 'fia',
    name_zh: '菲亞',
    name_en: 'Fia',
    image_url: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546781/snow-wolf/full/tuhg6allkxuy9simpyrk.png',
    capacity: 3,
    description_zh: '擁有雪之力量的神秘女孩',
    description_en: 'Mysterious girl with snow powers',
  },
];

/**
 * Helper function to create a role with default capacity
 * If capacity is not provided, defaults to 4
 */
export function createRoleWithDefaults(
  roleData: Omit<CharacterRole, 'capacity'> & { capacity?: number }
): CharacterRole {
  return {
    ...roleData,
    capacity: roleData.capacity ?? 4,
  };
}
