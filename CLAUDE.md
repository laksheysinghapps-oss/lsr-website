# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LSR Realty is a luxury real estate investment advisory website for Gurgaon, India. It's a React 19 + Vite SPA with client-side routing, built for a boutique real estate advisory firm targeting HNI/UHNI and NRI investors.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS (via CDN), React Router (HashRouter), Recharts, Lucide React

**Routing:** Uses HashRouter (`/#/path`) for compatibility with static hosting. Routes defined in `App.tsx`.

**Project Structure:**
```
├── App.tsx              # Main app with routing and layout (Navbar/Footer wrapper)
├── index.tsx            # React entry point
├── index.html           # HTML template with Tailwind config and custom colors
├── constants.tsx        # All static data (projects, services, nav items, company info)
├── types.ts             # TypeScript interfaces (Project, Service, TeamMember, etc.)
├── components/          # Reusable components (Navbar, Footer, ProjectCard)
├── pages/               # Route pages (Home, About, Services, Projects, etc.)
├── lib/                 # Utilities (submitLead.ts for form submission)
└── public/images/       # Static assets (logos, project images)
```

**Data Flow:** All content (projects, services, insights) lives in `constants.tsx` and is imported where needed. No backend/API - purely static content.

**Lead Capture:** Forms submit to a Google Apps Script endpoint (`lib/submitLead.ts`) using no-cors mode.

## Styling

- Tailwind via CDN with custom theme defined in `index.html`
- Custom colors: `lsr-gold` (#C6A667), `lsr-black` (#000000), `lsr-charcoal` (#1A1A1A)
- Fonts: Playfair Display (headings), Inter (body)
- Dark theme throughout - black backgrounds with gold accents

## Key Patterns

- Path alias: `@/*` maps to project root (configured in `tsconfig.json` and `vite.config.ts`)
- All nav links use `NavLink` from react-router-dom with active state styling
- Project detail pages use URL param `:id` matching `project.id` from constants
- Floating WhatsApp button appears on all pages (defined in `App.tsx`)
