# Global Gate Mexico

**Premium logistics and dangerous goods compliance services in Mexico and North America.**

Global Gate Mexico is a bilingual (English/Spanish) marketing website for a specialized logistics and compliance services company, offering dangerous goods transport, ADN/IATA/IMDG regulatory training, and full supply-chain compliance consulting.

## Tech Stack

- **React 19** + TypeScript
- **Vite 6** — build tooling
- **Tailwind CSS v4** — styling
- **Motion** — animations
- **React Router v7** — client-side routing
- **Lucide React** — icons
- **ElevenLabs Convai** — embedded AI voice assistant

## Getting Started

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | TypeScript type-check |

## Project Structure

```
src/
├── components/       # Shared UI components (Navbar, Footer, Layout, Icon, UI)
├── context/          # Language context (EN/ES translations)
├── lib/              # Utility functions
├── pages/            # Route pages (Home, Services, About, Training)
├── constants.ts      # Static data (services, stats, industries, testimonials)
├── types.ts          # TypeScript interfaces
└── main.tsx          # App entry point
```

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key (optional — for AI features) |
| `APP_URL` | Deployed app URL (used for self-referential links) |

## Features

- Fully bilingual UI — English / Spanish toggle
- Animated landing page with statistics, testimonials, and case studies
- Multi-step contact form
- Dedicated pages for Services, About, and Training
- Embedded AI voice assistant via ElevenLabs Convai
- Mobile-responsive design

## Contact

Global Gate Mexico — [antonio.perea@globalgatemexico.com](mailto:antonio.perea@globalgatemexico.com)
