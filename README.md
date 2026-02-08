# Snow Wolf Boy Event Registration System

A premium event registration platform designed for parents to register their children for themed recording and creative sessions.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Management**: React Hook Form + Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── ...
├── lib/                  # Utility functions and API
├── types/                # TypeScript type definitions
└── public/               # Static assets

```

## Design System

### Colors

- **Brand**: Navy, Midnight, Slate, Frost, Snow
- **Accent**: Moon Gold, Ice Blue, Aurora Purple

### Typography

- **Headings**: Playfair Display
- **Body**: Inter
- **Mono**: JetBrains Mono

## Development Strategy

This project follows a **UI-first development strategy**:

1. **Phase 1**: Premium UI with mock data
2. **Phase 2**: Backend integration and business logic

## License

Proprietary - All rights reserved
