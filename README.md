# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (auth & database)
- Cloudflare R2 (media storage via S3-compatible API)
- Vercel serverless functions (R2 proxy layer)

## Media upload architecture

File uploads (headshots, audio reels, documents) flow through Vercel serverless functions that proxy requests to a **private** Cloudflare R2 bucket. The client never has direct access to R2 credentials.

```
Browser  ──POST /api/upload──▶  Vercel function  ──PutObject──▶  R2 bucket
Browser  ──POST /api/signed-url──▶  Vercel function  ──getSignedUrl──▶  pre-signed URL
Browser  ──POST /api/delete──▶  Vercel function  ──DeleteObject──▶  R2 bucket
```

All three serverless functions share a single R2 client factory in `api/_r2.ts`.

Object keys follow the pattern: `actor-submissions/{submissionId}/{folder}/{filename}`

## Environment variables

Copy `.env.example` to `.env` for local development.

### Client-side (build-time, set in Vercel **and** locally)

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

### Server-side (Vercel project settings only — never commit)

| Variable | Required | Description |
|---|---|---|
| `R2_ACCOUNT_ID` | Yes* | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | Yes | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 API token secret |
| `R2_BUCKET_NAME` | Yes | R2 bucket name |
| `R2_ENDPOINT` | No | Optional endpoint override (defaults to `https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com`) |

\* Required unless `R2_ENDPOINT` is provided.

## How can I deploy this project?

Deploy to Vercel and configure the environment variables listed above in your Vercel project settings. The `api/` directory is automatically deployed as serverless functions.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
