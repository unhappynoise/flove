# Flové

**Where quality meets luxury.**

A full-stack e-commerce site built for a real client, with a genuine shopping cart, category and sub-type filtering, a live price guide, and an admin backend for product management — all running on completely free infrastructure.

**Live site:** https://flove-store.vercel.app

---

## Tech Stack

**Frontend**
- Next.js (App Router, TypeScript)
- Tailwind CSS v4
- Deployed on Vercel

**Backend**
- Strapi v5 (headless CMS, Node.js/TypeScript)
- PostgreSQL via Supabase (session pooler, IPv4-compatible)
- Cloudinary for media storage
- Deployed on Render

## Features

- Real shopping cart with persistent client-side state
- Category and sub-type product filtering
- Dynamic price-guide with per-category price ranges and exact pricing on individual items
- Fully responsive, including a custom mobile navigation
- Rate limiting on public API and auth endpoints
- Locked-down CORS, security headers, and MIME-type allow/deny lists on file uploads
- Role-based admin access (client has an Editor account scoped to content management only)

## Architecture Notes

This project was deliberately built on free-tier infrastructure end-to-end:

- **Render** (backend hosting) has no persistent disk on its free tier, so all media uploads go straight to **Cloudinary** instead of local storage.
- **Supabase** (Postgres) uses the session pooler for IPv4 compatibility with Render's networking.
- Both tiers have sleep/pause behavior under inactivity (documented in the deploy config) — a worthwhile tradeoff for zero ongoing hosting cost.

## Project Structure

flove/
├── backend/ # Strapi CMS — content types, API, admin panel
└── frontend/ # Next.js storefront


## Running Locally

**Backend**

cd backend
npm install
npm run develop


**Frontend**

cd frontend
npm install
npm run dev


Both need their own `.env` files — see `.env.example` in each directory (or ask for the required variables).

---

Built by [Babs](https://github.com/unhappynoise).
