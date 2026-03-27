ConvergENS — A multi-language Next.js news aggregation platform powered by Directus CMS.

This application displays articles and content from multiple organizations with international language support, built with Tailwind CSS and designed for responsive layouts.

## Features

**Content Management**

- Directus CMS integration for dynamic content fetching
- Multi-language support with next-intl
- Homepage, articles, organisations, events, and collectives

**Design & UI**

- Tailwind CSS 4 for responsive, modern styling
- Radix UI primitives for accessible components (Dialogs, Tabs, Selects)
- Lucide React icons and motion/GSAP animations
- Dark mode ready with next-themes
- Internationalization via react-string-replace

**Performance**

- Next.js 15 App Router architecture
- Image optimization via Next.js Image component
- Automatic build optimizations with Turbopack
- Lazy-loaded components for large content areas

## Dependencies

See `package.json` in this repo:

- Next.js 15 + React 19 for SSR/SSG
- Directus SDK v20 for CMS
- Tailwind CSS 4 + Radix UI components
- GSAP/Motion/GSAP for animations
- next-intl for multi-language support
