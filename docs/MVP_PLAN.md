# MVP Plan: AI-Powered Real Estate Search

## Overview
This document outlines the plan for building a plug-and-play, scalable, and high-value real estate search product using free and open-source tools for rapid prototyping.

## Tech Stack Rationale
- **Frontend:** Next.js + Tailwind CSS (modern, fast, easy to style)
- **Backend:** Next.js API routes (serverless, easy to deploy)
- **Database:** PostgreSQL (local or managed, e.g., Supabase)
- **Vector Search:** ChromaDB (open-source, easy to run locally or in the cloud)
- **NLP Embeddings:** Hugging Face models (e.g., `intfloat/e5-small-v2`)
- **Image Analysis:** Hugging Face models (BLIP, CLIP, ViT)
- **Admin Dashboard:** Retool (free tier) or custom Next.js dashboard
- **Authentication:** Supabase Auth or NextAuth.js
- **Hosting:** Vercel (free tier)

## Week-by-Week Implementation

### Week 1: Core Search Prototype
- Set up ChromaDB locally or in the cloud
- Integrate Hugging Face embedding model for text search
- Build basic search API
- Add a few property entries manually (JSON or DB)
- Test search with mock data

### Week 2: Image Analysis
- Integrate BLIP for image captioning
- Integrate ViT/CLIP for image embeddings
- Store image features in ChromaDB
- Test image-based search and filtering

### Week 3: Admin & Integration
- Set up Retool dashboard or build custom admin UI
- Implement authentication (Supabase Auth or NextAuth.js)
- Create data import system (CSV, manual, or web scraping)
- Test full user flow (from data import to search)

### Week 4: Polish & Launch
- UI/UX improvements
- Performance optimization
- Documentation
- Onboard first test client

## Key Principles
- Use only free/open-source tools for MVP
- Design for easy migration to scalable/paid services later
- Focus on rapid iteration and user feedback
- Keep integration for clients as simple as possible (one-liner embed)

---
_Last updated: 2024-06-13_ 