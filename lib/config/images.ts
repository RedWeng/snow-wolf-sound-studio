/**
 * Image Configuration
 * 
 * Centralized image paths for easy management and updates.
 * All images use Cloudinary CDN URLs.
 */

// Direct Cloudinary URLs (hardcoded for reliability)
export const images = {
  hero: {
    main: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546855/snow-wolf/image2/yauych2msulvecohxune.png', // RPG.png
  },
  content: {
    studioEquipment: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546855/snow-wolf/image2/yauych2msulvecohxune.png', // RPG.png
    creativeSession: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546948/snow-wolf/image2/ktpsulwti7kfh3x5on9j.png', // 沒有對齊的世界.png
    teamPhoto: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546872/snow-wolf/image2/ws425m0nsjkvixnykvwr.png', // 大合照@3x-8.png
  },
  sessions: {
    session1: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546844/snow-wolf/image2/gn7cpoyfwmmgevotkevq.png', // 5-7歲的繪本場.png
    session2: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546861/snow-wolf/image2/tktgivd9vkvjlt4qrbjd.png', // RPG_古神殿之謎.png
    session3: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546879/snow-wolf/image2/ebgv5e1uawtkvnfbqm9x.png', // 家庭動畫配音.png
    session4: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546861/snow-wolf/image2/tktgivd9vkvjlt4qrbjd.png', // RPG_古神殿之謎.png
    session5: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546953/snow-wolf/image2/xjqswy7mcah32qn6uant.png', // 穆高爾傳說RPG.png
    session6: 'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546943/snow-wolf/image2/hwjunrdoltwaslaaxbpk.jpg', // 時空冒險.jpg
  },
  gallery: [
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546838/snow-wolf/image2/fovd5swwr9eunsm6qc3k.png', // 151_珍珠暴衝反擊_關鍵場景.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546948/snow-wolf/image2/ktpsulwti7kfh3x5on9j.png', // 沒有對齊的世界.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546821/snow-wolf/image/j4pkai0fyyynx2dxjuae.png', // 1769486410119-artguru.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546828/snow-wolf/image/enw2kls7nqyic8cm7urv.png', // 1769486410123-artguru.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546834/snow-wolf/image/svxlnzmvm9q0c9mcb3rf.png', // 1769486410231-artguru.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546855/snow-wolf/image2/yauych2msulvecohxune.png', // RPG.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546861/snow-wolf/image2/tktgivd9vkvjlt4qrbjd.png', // RPG_古神殿之謎.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546879/snow-wolf/image2/ebgv5e1uawtkvnfbqm9x.png', // 家庭動畫配音.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546872/snow-wolf/image2/ws425m0nsjkvixnykvwr.png', // 大合照@3x-8.png
  ],
  extra: [
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546864/snow-wolf/image2/op5qqcpikn2j7nhnpwnx.png', // 勇者之劍_寫實風格.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546866/snow-wolf/image2/hsqrzsochtlcxz1hrwhu.jpg', // 動漫MV錄製.jpg
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546943/snow-wolf/image2/hwjunrdoltwaslaaxbpk.jpg', // 時空冒險.jpg
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546953/snow-wolf/image2/xjqswy7mcah32qn6uant.png', // 穆高爾傳說RPG.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546955/snow-wolf/image2/dyvhwvoo8kutow03f4eg.png', // 金屬底背景圖.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546957/snow-wolf/image2/kbxjj8cqujk2ebmg9y60.png', // 麵包_RPG風格.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546821/snow-wolf/image/j4pkai0fyyynx2dxjuae.png', // 1769486410119-artguru.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546828/snow-wolf/image/enw2kls7nqyic8cm7urv.png', // 1769486410123-artguru.png
    'https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546834/snow-wolf/image/svxlnzmvm9q0c9mcb3rf.png', // 1769486410231-artguru.png
  ],
};

// Helper function to get random session image
export function getRandomSessionImage(): string {
  const sessionImages = Object.values(images.sessions);
  return sessionImages[Math.floor(Math.random() * sessionImages.length)];
}
