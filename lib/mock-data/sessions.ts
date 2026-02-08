import { Session } from '../types/database';

/**
 * Mock sessions data - 2026 April-June Season
 * Updated with final confirmed sessions from C大
 * Requirements: 2.1, 3.2, 6.1
 */
export const mockSessions: Session[] = [
  // ① 4/12（日）- 雪狼經典場 × 擬音錄音
  {
    id: 'session-2026-04-12',
    title_zh: '雪狼經典場 × 擬音錄音',
    title_en: 'Snow Wolf Classic × Foley Recording',
    theme_zh: '全齡家庭場 · 擬音體驗',
    theme_en: 'All Ages Family Session · Foley Experience',
    story_zh: '金鐘獎最佳音效獎吳培倫老師親自帶領，體驗專業擬音師的工作，為雪狼男孩動畫創造聲音魔法！',
    story_en: 'Led by Golden Bell Award-winning sound effects master Wu Pei-Lun, experience the work of professional foley artists and create sound magic for Snow Wolf Boy animation!',
    description_zh: '在玉成錄音室，培倫老師將帶領全家一起探索擬音的奧秘。從腳步聲到環境音，每個聲音都是一門藝術。適合全家大小一起參與，共同創作屬於你們的聲音作品。',
    description_en: 'At Yucheng Recording Studio, Teacher Pei-Lun will lead the whole family to explore the mysteries of foley. From footsteps to ambient sounds, every sound is an art form. Suitable for the whole family to participate together and create your own sound work.',
    venue_zh: '玉成錄音室',
    venue_en: 'Yucheng Recording Studio',
    date: '2026-04-12',
    day_of_week: '日',
    time: '13:00',
    duration_minutes: 180,
    capacity: 15, // 家庭15組
    hidden_buffer: 0,
    price: 3600, // 家庭場固定價
    age_min: 2,
    age_max: 99,
    image_url: '/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png',
    video_url: '/video/經典場動畫.mp4',
    status: 'active',
    current_registrations: 12, // 12/15 families registered
    addon_registrations: {
      'addon-animation-recording': 2, // 2/4 addon slots used
    },
    tags: ['#原著故事重現', '#金鐘最佳音效師'],
    roles: [
      {
        id: 'litt',
        name_zh: '里特',
        name_en: 'Litt',
        image_url: '/full/Litt-full.png',
        capacity: 3,
        description_zh: '雪狼男孩主角，勇敢且充滿正義感',
        description_en: 'Snow Wolf Boy protagonist, brave and full of justice',
      },
      {
        id: 'dean',
        name_zh: '迪恩',
        name_en: 'Dean',
        image_url: '/full/dean-BfniCFnX.png',
        capacity: 3,
        description_zh: '里特的好友，聰明機智',
        description_en: 'Litt\'s friend, smart and witty',
      },
      {
        id: 'heather',
        name_zh: '海瑟',
        name_en: 'Heather',
        image_url: '/full/heather-full.png',
        capacity: 3,
        description_zh: '溫柔善良的女孩',
        description_en: 'Gentle and kind girl',
      },
      {
        id: 'aileen',
        name_zh: '艾琳',
        name_en: 'Aileen',
        image_url: '/full/aileen-full.png',
        capacity: 3,
        description_zh: '活潑開朗的女孩',
        description_en: 'Lively and cheerful girl',
      },
      {
        id: 'fia',
        name_zh: '菲亞',
        name_en: 'Fia',
        image_url: '/full/fia-full.png',
        capacity: 3,
        description_zh: '擁有雪之力量的神秘女孩',
        description_en: 'Mysterious girl with snow powers',
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ② 4/19（日）- 彰化包場（不開放報名）
  {
    id: 'session-2026-04-19',
    title_zh: '雪狼雙語全日場（已包場）',
    title_en: 'Snow Wolf Bilingual Full Day (Private Booking)',
    theme_zh: '包場活動',
    theme_en: 'Private Event',
    story_zh: '此場次為包場活動，不開放公開報名。',
    story_en: 'This session is a private booking and not open for public registration.',
    description_zh: '此場次為包場活動，不開放公開報名。如需包場服務，請聯繫我們。',
    description_en: 'This session is a private booking and not open for public registration. For private booking services, please contact us.',
    venue_zh: '彰化場地',
    venue_en: 'Changhua Venue',
    date: '2026-04-19',
    day_of_week: '日',
    time: '09:00',
    duration_minutes: 480,
    capacity: 0,
    hidden_buffer: 0,
    price: 0, // Private booking - no public price
    age_min: null,
    age_max: null,
    image_url: '/image2/雪狼男孩_天裂之時_翠妮絲風之試煉.png',
    video_url: '/video/SNOWWOLFBOY_卡達爾之戰.mp4',
    status: 'cancelled', // 系統不顯示在active列表
    current_registrations: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ③ 4/26（日）- 慢慢先生的一天 A場（小小孩劇場）
  {
    id: 'session-2026-04-26-a',
    title_zh: '慢慢先生的一天 A場',
    title_en: 'Mr. Slow\'s Day Session A',
    theme_zh: '小小孩劇場 · 肢體語言 · 無字動畫',
    theme_en: 'Little Kids Theater · Body Language · Silent Animation',
    story_zh: '忘東忘西的慢慢先生走得很慢，卻在路上遇見很多願意等他慢慢走的朋友，他能夠順利找到回家的路嗎？',
    story_en: 'Mr. Slow, who is forgetful and walks slowly, meets many friends willing to wait for him along the way. Will he find his way home?',
    description_zh: '昱佳老師帶領小小孩們透過肢體語言和藝術舞蹈，探索無字動畫的世界。專為幼齡孩子設計的慢節奏體驗，讓孩子用身體說故事。地點：DD BOX（台北兒童新樂園內2F劇場）',
    description_en: 'Teacher Yu-Jia leads young children to explore the world of silent animation through body language and art dance. A slow-paced experience designed specifically for young children, letting them tell stories with their bodies. Venue: DD BOX (2F Theater inside Taipei Children\'s Amusement Park)',
    venue_zh: 'DD BOX（台北兒童新樂園內2F劇場）',
    venue_en: 'DD BOX (2F Theater, Taipei Children\'s Amusement Park)',
    date: '2026-04-26',
    day_of_week: '日',
    time: '13:30',
    duration_minutes: 100,
    capacity: 18,
    hidden_buffer: 0,
    price: 2600,
    age_min: 5,
    age_max: 7,
    image_url: '/image2/5-7歲的繪本場.png',
    video_url: '/video/慢慢先生的一天.mp4',
    status: 'active',
    current_registrations: 18, // 18/18 kids = Full - 名額已滿
    addon_registrations: {
      'addon-animation-recording': 4, // 4/4 addon slots FULL
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ③-B 4/26（日）- 慢慢先生的一天 B場（小小孩劇場）
  {
    id: 'session-2026-04-26-b',
    title_zh: '慢慢先生的一天 B場',
    title_en: 'Mr. Slow\'s Day Session B',
    theme_zh: '小小孩劇場 · 肢體語言 · 無字動畫',
    theme_en: 'Little Kids Theater · Body Language · Silent Animation',
    story_zh: '忘東忘西的慢慢先生走得很慢，卻在路上遇見很多願意等他慢慢走的朋友，他能夠順利找到回家的路嗎？',
    story_en: 'Mr. Slow, who is forgetful and walks slowly, meets many friends willing to wait for him along the way. Will he find his way home?',
    description_zh: '昱佳老師帶領小小孩們透過肢體語言和藝術舞蹈，探索無字動畫的世界。專為幼齡孩子設計的慢節奏體驗，讓孩子用身體說故事。地點：DD BOX（台北兒童新樂園內2F劇場）',
    description_en: 'Teacher Yu-Jia leads young children to explore the world of silent animation through body language and art dance. A slow-paced experience designed specifically for young children, letting them tell stories with their bodies. Venue: DD BOX (2F Theater inside Taipei Children\'s Amusement Park)',
    venue_zh: 'DD BOX（台北兒童新樂園內2F劇場）',
    venue_en: 'DD BOX (2F Theater, Taipei Children\'s Amusement Park)',
    date: '2026-04-26',
    day_of_week: '日',
    time: '16:00',
    duration_minutes: 100,
    capacity: 18,
    hidden_buffer: 0,
    price: 2600,
    age_min: 5,
    age_max: 7,
    image_url: '/image2/5-7歲的繪本場.png',
    video_url: '/video/慢慢先生的一天.mp4',
    status: 'active',
    current_registrations: 0, // 0/18 kids = 全新場次開放報名
    addon_registrations: {
      'addon-animation-recording': 0, // 0/4 addon slots available
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ④ 5/17（日）- 時空 MV 場＋機器人 LIVE 錄音
  {
    id: 'session-2026-05-17',
    title_zh: '時空 MV 場＋機器人 LIVE 錄音',
    title_en: 'Time Travel MV + Robot LIVE Recording',
    theme_zh: '家庭場 · MV錄製 · 機器人互動',
    theme_en: 'Family Session · MV Recording · Robot Interaction',
    story_zh: '時光機啟動了！全家一起穿越時空，錄製專屬MV，還有3M機器人現場互動，創造難忘的家庭回憶！',
    story_en: 'The time machine is activated! Travel through time with the whole family, record your exclusive MV, and interact with 3M robots live to create unforgettable family memories!',
    description_zh: '在玉成錄音室，全家一起體驗MV錄製的樂趣。從選歌、排練到正式錄音，專業團隊全程協助。還有機器人互動環節，讓科技與藝術完美結合。',
    description_en: 'At Yucheng Recording Studio, experience the fun of MV recording with the whole family. From song selection, rehearsal to official recording, the professional team assists throughout. There\'s also a robot interaction session, perfectly combining technology and art.',
    venue_zh: '玉成錄音室',
    venue_en: 'Yucheng Recording Studio',
    current_registrations: 5, // 5/25 kids = 20% - 已有來自各地的冒險者
    date: '2026-05-17',
    day_of_week: '日',
    time: '13:00',
    duration_minutes: 120,
    capacity: 25, // 25位小孩
    hidden_buffer: 0,
    price: 2800, // 改為2800元
    age_min: 2,
    age_max: 99,
    image_url: '/image2/動漫MV錄製.jpg',
    video_url: '/video/穿越吧! 時空.mp4',
    status: 'active',
    addon_registrations: {
      'addon-animation-recording': 1, // 1/4 addon slots used
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ⑤ 5/24（日）- 世界沒有對齊 A場（小小孩劇場）
  {
    id: 'session-2026-05-24-a',
    title_zh: '世界沒有對齊 A場',
    title_en: 'The World Is Misaligned Session A',
    theme_zh: '小小孩劇場 · 肢體語言 · 無字動畫',
    theme_en: 'Little Kids Theater · Body Language · Silent Animation',
    story_zh: '星期日早上，茶莉出門時發現世界開始有點不一樣，街道還在，學校還在，但每個人走在不同的時間跟方向裡...',
    story_en: 'On Sunday morning, Charlie goes out and discovers the world has become a bit different. The streets are still there, the school is still there, but everyone is walking in different times and directions...',
    description_zh: '筱茵老師帶領小小孩們在這個沒有對齊的世界裡，透過肢體語言和藝術舞蹈探索。專為幼齡孩子設計的慢節奏體驗。地點：DD BOX（台北兒童新樂園內2F劇場）',
    description_en: 'Teacher Hsiao-Yin leads young children to explore this misaligned world through body language and art dance. A slow-paced experience designed specifically for young children. Venue: DD BOX (2F Theater inside Taipei Children\'s Amusement Park)',
    venue_zh: 'DD BOX（台北兒童新樂園內2F劇場）',
    venue_en: 'DD BOX (2F Theater, Taipei Children\'s Amusement Park)',
    date: '2026-05-24',
    day_of_week: '日',
    time: '13:30',
    duration_minutes: 100,
    capacity: 18,
    hidden_buffer: 0,
    price: 2600,
    age_min: 5,
    age_max: 7,
    image_url: '/image2/沒有對齊的世界2.png',
    video_url: '/video/沒有對齊的世界.mp4',
    status: 'active',
    current_registrations: 17, // 17/18 kids = 1 spot left - 剩下1名冒險名額
    addon_registrations: {
      'addon-animation-recording': 0, // 0/4 addon slots available
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ⑤-B 5/24（日）- 世界沒有對齊 B場（小小孩劇場）
  {
    id: 'session-2026-05-24-b',
    title_zh: '世界沒有對齊 B場',
    title_en: 'The World Is Misaligned Session B',
    theme_zh: '小小孩劇場 · 肢體語言 · 無字動畫',
    theme_en: 'Little Kids Theater · Body Language · Silent Animation',
    story_zh: '星期日早上，茶莉出門時發現世界開始有點不一樣，街道還在，學校還在，但每個人走在不同的時間跟方向裡...',
    story_en: 'On Sunday morning, Charlie goes out and discovers the world has become a bit different. The streets are still there, the school is still there, but everyone is walking in different times and directions...',
    description_zh: '筱茵老師帶領小小孩們在這個沒有對齊的世界裡，透過肢體語言和藝術舞蹈探索。專為幼齡孩子設計的慢節奏體驗。地點：DD BOX（台北兒童新樂園內2F劇場）',
    description_en: 'Teacher Hsiao-Yin leads young children to explore this misaligned world through body language and art dance. A slow-paced experience designed specifically for young children. Venue: DD BOX (2F Theater inside Taipei Children\'s Amusement Park)',
    venue_zh: 'DD BOX（台北兒童新樂園內2F劇場）',
    venue_en: 'DD BOX (2F Theater, Taipei Children\'s Amusement Park)',
    date: '2026-05-24',
    day_of_week: '日',
    time: '16:00',
    duration_minutes: 100,
    capacity: 18,
    hidden_buffer: 0,
    price: 2600,
    age_min: 5,
    age_max: 7,
    image_url: '/image2/沒有對齊的世界2.png',
    video_url: '/video/沒有對齊的世界.mp4',
    status: 'active',
    current_registrations: 0, // 0/18 kids = 全新場次開放報名
    addon_registrations: {
      'addon-animation-recording': 0, // 0/4 addon slots available
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ⑥ 6/14（日）- 雪狼男孩《卡達爾之戰》動畫場
  {
    id: 'session-2026-06-14',
    title_zh: '雪狼男孩《卡達爾之戰》動畫場',
    title_en: 'Snow Wolf Boy "Battle of Kadar" Animation Session',
    theme_zh: '大孩子動畫場 · 動畫配音',
    theme_en: 'Big Kids Animation · Voice Acting',
    story_zh: '化身雪狼男孩系列動畫角色，透過專業配音訓練，用聲音詮釋勇氣、友情與正義！',
    story_en: 'Become characters from the Snow Wolf Boy series, and express courage, friendship, and justice through professional voice acting training!',
    description_zh: '昀晴老師（建議）帶領大孩子們進入專業配音世界。在DD BOX 135劇場，孩子們將學習角色分析、情感表達、聲音技巧，錄製屬於自己的動畫片段。',
    description_en: 'Teacher Yun-Qing (recommended) leads older children into the professional voice acting world. At DD BOX 135 Theater, children will learn character analysis, emotional expression, voice techniques, and record their own animation segments.',
    venue_zh: 'DD BOX 135劇場',
    venue_en: 'DD BOX 135 Theater',
    date: '2026-06-14',
    day_of_week: '日',
    time: '13:00',
    duration_minutes: 165,
    capacity: 20,
    hidden_buffer: 0,
    price: 3600,
    age_min: 8,
    age_max: 13,
    image_url: '/image2/SNOWWOLFBOY_卡達爾之戰.png',
    video_url: '/video/SNOWWOLFBOY_卡達爾之戰.mp4',
    status: 'active',
    current_registrations: 3, // 3/20 kids = 15% - 冒險者集結中
    addon_registrations: {
      'addon-animation-recording': 3, // 3/4 addon slots used
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ⑦ 6/28（日）- RPG《穆高爾傳說》遊戲廣告錄音
  {
    id: 'session-2026-06-28',
    title_zh: 'RPG《穆高爾傳說》遊戲廣告錄音',
    title_en: 'RPG "Legend of Mughal" Game Ad Recording',
    theme_zh: '家庭場 · RPG遊戲 · 廣告配音',
    theme_en: 'Family Session · RPG Game · Ad Voice Acting',
    story_zh: '穆高爾大陸的命運掌握在你手中！全家一起為RPG遊戲錄製廣告，體驗專業配音的魅力！',
    story_en: 'The fate of the Mughal continent is in your hands! Record game ads for RPG with the whole family and experience the charm of professional voice acting!',
    description_zh: '一帆老師（建議）帶領全家進入RPG遊戲世界。在玉成錄音室，從角色設定到廣告錄製，體驗完整的遊戲配音流程。適合8-13歲孩子與家人一起參與。',
    description_en: 'Teacher Yi-Fan (recommended) leads the whole family into the RPG game world. At Yucheng Recording Studio, from character setup to ad recording, experience the complete game voice acting process. Suitable for children aged 8-13 and their families.',
    venue_zh: '玉成錄音室',
    venue_en: 'Yucheng Recording Studio',
    date: '2026-06-28',
    day_of_week: '日',
    time: '13:00',
    duration_minutes: 130,
    capacity: 15, // 家庭15組
    hidden_buffer: 0,
    price: 5500, // 家庭場固定價
    age_min: 8,
    age_max: 13,
    image_url: '/image2/穆高爾傳說RPG.png',
    video_url: '/video/穆高爾傳說.mp4',
    status: 'active',
    current_registrations: 14, // 14/15 families = 1 spot left - 剩下1名冒險名額
    addon_registrations: {
      'addon-animation-recording': 0, // 0/4 addon slots available
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
