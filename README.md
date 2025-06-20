This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## MVP Bootstrapping Suggestions (2024)

To rapidly build and test the AI-powered real estate search MVP, leverage free and open-source tools:

### 1. Natural Language Search Engine
- Use Hugging Face embedding models (e.g., `intfloat/e5-small-v2`, `BAAI/bge-small-en`)
- Use ChromaDB (open-source, local, or managed) for vector search
- GitHub starter kits: [ChromaDB](https://github.com/chroma-core/chroma), [LangChain + vectorstore](https://github.com/hwchase17/langchain)

### 2. Property Image Analysis
- Use Hugging Face models:
  - `Salesforce/blip-image-captioning-base` for image captions
  - `google/vit-base-patch16-224` for visual embeddings
  - `openai/clip-vit-base-patch32` for joint vision-language search
- GitHub: [BLIP](https://github.com/salesforce/BLIP), [CLIP](https://github.com/openai/CLIP)

### 3. Data Management & Dashboard
- Use Retool (free tier) or build with Next.js + Tailwind
- Storage: Supabase (PostgreSQL), Firebase, or MongoDB Atlas (all have free tiers)
- Open-source dashboard templates: [Tailwind Toolbox Admin](https://github.com/tailwindtoolbox/Admin-Dashboard)

### 4. Search UI Frontend
- Next.js + Tailwind CSS
- Autocomplete: `@algolia/autocomplete-js`
- UI extras: Framer Motion, Shadcn UI, Lottie

### 5. Backend Infra & Hosting
- Vercel (free tier)
- Cloudflare Pages, Render, or Railway for backend/cron jobs

### 6. Authentication (Admin Panel)
- Supabase Auth (email magic links/passwordless)
- Clerk/NextAuth.js for advanced auth

### 7. Free Dev Tools
- Prompt playgrounds: Hugging Face Spaces, LangChain prompt tools
- Data labeling: Label Studio (free/self-hosted)

### Qdrant Cluster Setup
- For MVP/testing, select **"Create a Free Cluster"** (1 node, 4GiB disk, 1GiB RAM, 0.5 vCPUs)
- Upgrade to dedicated cluster as needed

### Why This Stack?
- All tools are free or have generous free tiers
- Fast to set up and iterate
- Easy to swap out for paid/scalable services later
- Large open-source community and documentation
