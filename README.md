# Life Plan — Through The Time

> An immersive, story-driven personal Life Journey web application documenting a life timeline from 2026 into the future, with a full-featured admin CMS behind it.

🔗 **Live Demo:** _coming soon_
📖 **Documentation:** This README

---

## Overview

**Life Plan** is a full-stack personal portfolio/life-journey application built as both a real planning tool and a technical showcase. Each era of life (2026–2033+) is represented through a distinct visual theme — Galaxy, Monthly, Racing, Voyage, and Tree — rendered dynamically from a flexible content model, backed by a full-featured admin CMS.

This is **not a conventional portfolio site** — it's designed to feel like an immersive, narrative-based application, while doubling as a real production-grade system showcase.

## Screenshots

| Home                                 | Timeline Overview                            |
| ------------------------------------ | -------------------------------------------- |
| ![Home](./docs/screenshots/home.png) | ![Timeline](./docs/screenshots/timeline.png) |

| Year Detail (Galaxy Theme)               | Year Detail (Monthly Theme)                |
| ---------------------------------------- | ------------------------------------------ |
| ![Galaxy](./docs/screenshots/galaxy.png) | ![Monthly](./docs/screenshots/monthly.png) |

| Admin Dashboard                        |
| -------------------------------------- |
| ![Admin](./docs/screenshots/admin.png) |

## Tech Stack

**Core**

- [Next.js 16](https://nextjs.org/) — App Router, TypeScript
- [Prisma 7](https://www.prisma.io/) — ORM with `@prisma/adapter-pg` driver adapter
- [Neon](https://neon.tech/) — Serverless PostgreSQL

**Auth**

- [NextAuth.js v5](https://authjs.dev/) — Credentials Provider, JWT sessions, edge-safe middleware split
- `bcryptjs` for password hashing

**UI & Animation**

- [Tailwind CSS v4](https://tailwindcss.com/) — CSS-based theming via `@theme`
- [Framer Motion](https://www.framer.com/motion/) — component-level animation
- [GSAP](https://gsap.com/) + ScrollTrigger — scroll-based storytelling
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- [React Flow](https://reactflow.dev/) — interactive Master's Degree flowchart
- [Lucide React](https://lucide.dev/) — icons

**Validation**

- [Zod v4](https://zod.dev/) — schema validation on all forms

## Timeline Themes

| Era       | Theme               | Status                                                                              |
| --------- | ------------------- | ----------------------------------------------------------------------------------- |
| 2026      | Galaxy              | ✅ Full custom view                                                                 |
| 2027      | Monthly             | ✅ Full custom view                                                                 |
| 2028–2030 | Racing / Grand Prix | ✅ Full custom view with Achievement Tracker                                        |
| 2031–2032 | Voyage              | ✅ Full custom view with interactive Master's Degree flowchart                      |
| 2033+     | Tree / Growth       | ✅ Full custom view, with a distinct "Beyond" page for the founding-company chapter |

## Feature Highlights

### Public-facing

- Cinematic loading screen and animated home page with an auto-hiding, scroll-aware navbar
- Vertical scroll timeline overview with GSAP-driven mood transitions and theme-colored dot navigation
- Themed page transitions between the timeline overview and year-detail pages
- A public, read-only calendar showing upcoming published milestones across the whole timeline
- Fully responsive, with `prefers-reduced-motion` respected throughout
- SEO-first: dynamic per-page metadata, auto-generated `sitemap.xml` / `robots.txt`, JSON-LD Person schema

### Admin CMS

- Full CRUD for Eras, Content Blocks, Achievement Goals, and Admin Users
- Interactive React Flow editor for the Master's Degree flowchart (Country → University → Program)
- Dashboard with live stats, overall progress, and upcoming deadlines
- Calendar & deadline view with 1/3/7-day filters and overdue markers
- Search and combined filtering (title, era, theme, publish status, completion)
- Live, theme-aware preview of content blocks before publishing
- Drag-and-drop reordering for eras and content blocks
- Bulk actions (publish/unpublish, mark complete/pending, delete) for content blocks
- Soft delete with a dedicated Trash page (restore or permanently delete)
- Notification system with unread badge and deadline-based auto-generation via cron
- Full activity log auditing every admin action

## Architecture Highlights

- **Flexible content model** — a single `ContentBlock` model with a `type` + JSON `data` field renders completely different UI per era theme, keeping the backend schema stable while the frontend stays fully custom per year.
- **Edge-safe auth split** — `auth.config.ts` (no Node dependencies) powers route-protection via Next.js 16's `proxy.ts` convention on the Edge runtime, while `auth.ts` (with Prisma) handles full authentication logic on the Node runtime. Every admin server component also re-checks the session directly as defense-in-depth.
- **Activity logging** — every meaningful admin action (CRUD, completion toggles, bulk operations) is recorded with actor, action, entity, and a JSON detail snapshot.
- **Deadline notifications** — a cron-triggered, secret-protected endpoint scans `ContentBlock.deadline` and generates `DEADLINE_7D/3D/1D` notifications atomically, using a database-level unique constraint to guarantee no duplicates even under concurrent triggers.
- **Soft delete everywhere** — Eras and Content Blocks use a `deletedAt` timestamp rather than hard deletion, with a Trash UI for restore or permanent removal.

## Project Structure

src/
├── app/
│ ├── admin/ # Admin CMS (protected, its own layout + nav)
│ │ ├── achievements/
│ │ ├── calendar/
│ │ ├── content-blocks/
│ │ ├── eras/
│ │ ├── logs/
│ │ ├── master-degree/
│ │ ├── notifications/
│ │ ├── trash/
│ │ └── users/
│ ├── api/ # API routes (auth, cron)
│ ├── calendar/ # Public read-only calendar
│ ├── timeline/ # Timeline overview + [slug] year detail (theme-specific views)
│ └── about/ # About Me page
├── components/ # Shared UI components (navbar, cards, flowchart, etc.)
├── lib/
│ ├── actions/ # Server actions (CRUD)
│ ├── validations/ # Zod schemas
│ └── prisma.ts # Prisma client singleton
└── proxy.ts # Edge middleware (Next.js 16 convention, route protection)
prisma/
├── schema.prisma
└── seed.ts

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, AUTH_SECRET, AUTH_URL, CRON_SECRET, etc.

# Run database migrations
npx prisma migrate dev

# Seed an admin user
npx tsx prisma/seed.ts

# Start the dev server
npm run dev
```

## Deployment

Deployed on [Vercel](https://vercel.com), with:

- Environment variables configured per-environment (never committed)
- Vercel Cron calling `/api/cron/notifications` daily, authenticated via `CRON_SECRET`
- Neon serverless Postgres as the production database

## License

All Rights Reserved.

This repository is public for showcase purposes only. No pull requests, forks for redistribution, or reuse of code are permitted without explicit permission from the author.

---

Built with ❤️ by [Farisy Syarif](https://github.com/FarisyIlman)
