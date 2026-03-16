# Deployment Guide

## Current Deployment Stack
- Source control: GitHub
- Preview hosting: Vercel
- Database: Supabase

## Local Setup
1. Create `.env`
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Run the app locally

## Supabase Setup
1. Create a Supabase project
2. Run `supabase/schema.sql` in SQL Editor
3. Run `supabase/seed.sql` in SQL Editor
4. Copy project URL and anon key into env vars

## Vercel Setup
1. Connect GitHub repo
2. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy after env changes

## Important Deployment Rule
Keep the browser preview healthy first. Toss-specific runtime work should be added later in a way that does not break the open-web preview.
