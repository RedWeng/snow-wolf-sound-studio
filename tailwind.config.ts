import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A1628", // Deep night sky
          midnight: "#1A2B47", // Midnight blue
          slate: "#2D3E5F", // Slate blue
          frost: "#E8F1F8", // Frost white
          snow: "#F8FBFF", // Pure snow
        },
        accent: {
          moon: "#FFE5B4", // Moonlight gold
          ice: "#B8E6F5", // Ice blue
          aurora: "#C8B6FF", // Aurora purple
        },
        semantic: {
          success: "#10B981", // Green
          warning: "#F59E0B", // Amber
          error: "#EF4444", // Red
          info: "#3B82F6", // Blue
        },
        // A. 小小孩場 - 留白系 (日光宇宙) - Quiet, slow, airy
        // 🔧 調整1: 壓暗一點點，不再「白到發光」
        // 🔧 微調: 改為霧白/米白，不要全白太亮
        // 🔧 微調4: 加深文字顏色，提高對比度和可讀性
        daylight: {
          'card-bg': '#E8EBE9', // 霧白偏綠 (更柔和) - Main card background
          'card-gradient': '#DFE5E1', // 米白偏綠 (更溫暖) - Gradient end
          'title': '#1F2B27', // 深墨綠灰 (加深) - Title text
          'body': '#4A5B54', // Body text (加深)
          'tag-bg': '#E1ECE6', // Tag background
          'tag-text': '#2F4A3E', // Tag text (加深)
          'button-bg': '#D8E5DD', // Button background (中亮度，霧藍綠)
          'button-border': '#C9DDD3', // Button border
          'button-text': '#2A4838', // Button text (加深)
        },
        
        // B. 雪狼男孩場 - 暗能量系 (雷電宇宙) - Power, crisis, determination
        // 🔧 調整2: 提亮背景最暗處，不會像黑洞
        // 🔧 微調1: 降彩度 5-8%，從「英雄主視覺」→「平台卡片」
        storm: {
          'card-bg': '#272D35', // Main card background (提亮 + 降彩度)
          'card-gradient': '#343D4A', // Gradient end (提亮 + 降彩度)
          'title': '#E8ECF2', // 冷白 - Title text
          'body': '#AEB7C4', // Body text
          'tag-bg': '#2E394A', // Tag background
          'tag-text': '#B7C7E6', // Tag text
          'button-bg': '#2F6BFF', // 雷電藍 - Button background (中亮度)
          'button-hover': '#4C84FF', // Button hover
          'button-text': '#FFFFFF', // Button text
        },
        
        // C. 全站共用中性色 (只剩這些能共用)
        neutral: {
          'divider': '#D8DEE4', // 分隔線
          'disabled': '#9AA4AE', // 停用文字
          'icon': '#B0BCC8', // Icon 淡色
        },
        
        // D. 狀態色 - 平台中性化
        status: {
          'warning-bg': '#FFF4E6', // 暖杏色背景 (不是紅橘)
          'warning-border': '#FFD9A3', // 淡琥珀邊框
          'warning-text': '#B8860B', // 深金色文字
          'warning-icon': '#DAA520', // 金色圖示
        },
      },
      // 🔧 微調3: 統一狀態列高度 - 拉齊 4-6px
      spacing: {
        'status-bar': '0.875rem', // 14px - 統一狀態列 padding-y (py-3.5)
        xs: "0.5rem", // 8px
        sm: "0.75rem", // 12px
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
        "2xl": "3rem", // 48px
        "3xl": "4rem", // 64px
        "4xl": "6rem", // 96px
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"], // Elegant headings
        body: ["Inter", "sans-serif"], // Clean body text
        mono: ["JetBrains Mono", "monospace"], // Code/numbers
      },
      fontSize: {
        display: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h2: ["2.25rem", { lineHeight: "1.3" }],
        h3: ["1.875rem", { lineHeight: "1.4" }],
        h4: ["1.5rem", { lineHeight: "1.5" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      screens: {
        sm: "640px", // Mobile landscape
        md: "768px", // Tablet
        lg: "1024px", // Desktop
        xl: "1280px", // Large desktop
        "2xl": "1536px", // Extra large
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "350ms",
        slower: "500ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
