# REDI NGO Website

Modern redesign of the REDI NGO site — built with Next.js, Tailwind CSS, and Supabase. Production app: [redi-ngo-web.vercel.app](https://redi-ngo-web.vercel.app). The legacy WordPress site remains at [redi-ngo.eu](https://redi-ngo.eu) until DNS is switched.

## Live

| Environment | URL |
|-------------|-----|
| **Production (CMS)** | https://redi-ngo-web.vercel.app |
| **Content mirror (archive)** | https://redi-ngo-site.vercel.app |

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — custom design system (green/gold palette)
- **next-intl** — English + Romanian
- **Supabase** — database backend (news, tenders, contact)
- **Resend** — contact form emails
- **Vercel** — hosting

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, stats, impact, projects, news |
| `/about` | Mission, vision, team, board |
| `/impact` | REDI Fund, Recycling, Network, Business Club, Digital Boost |
| `/projects` | EU-funded and partner projects |
| `/news` | News articles and stories |
| `/work-with-us` | Tenders, volunteer, donate |
| `/contact` | Contact form |

## Development

```bash
npm install
npm run extract   # Re-extract content from mirror
npm run dev       # http://localhost:3000
npm run build
```

## Content

Content is extracted from the static mirror at `../redi-ngo-site/` via:

```bash
npm run extract
```

Output goes to `src/content/extracted/`. Curated content lives in `src/content/`.

## Deployment

Connected to Supabase project `redi-ngo-site` and deployed on Vercel. Set env vars from `.env.example`.

## Redirects

Old WordPress URLs redirect to new routes (see `next.config.ts`).
