# Deployment Guide for CodeFlow

This guide explains how to deploy the CodeFlow platform for free using **Vercel** (Frontend) and **Render** (Backend).

## Prerequisites

- GitHub Account (to push your code)
- Vercel Account (free tier)
- Render Account (free tier)
- MongoDB Atlas Account (free tier)
- Clerk Account (for auth)
- Stream Account (for video/chat)

## 1. Prepare Your Code

1.  Push your code to a GitHub repository.
2.  Ensure your `frontend` and `backend` are in the root of the repo (which they are).

## 2. Deploy Backend (Render)

Render is great for Node.js backends.

1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Configuration**:
    - **Name**: `codeflow-backend` (or similar)
    - **Root Directory**: `backend`
    - **Environment**: Node
    - **Build Command**: `npm install`
    - **Start Command**: `node src/server.js`
    - **Plan**: Free
5.  **Environment Variables** (Add these in the "Environment" tab):
    - `PORT`: `3000` (Render ignores this and assigns its own, but good to have)
    - `DB_URL`: Your MongoDB Atlas Connection String
    - `CLERK_PUBLISHABLE_KEY`: From Clerk Dashboard
    - `CLERK_SECRET_KEY`: From Clerk Dashboard
    - `STREAM_API_KEY`: From Stream Dashboard
     - `INNGEST_EVENT_KEY`: From Inngest
     - `INNGEST_SIGNING_KEY`: From Inngest
    - `STREAM_API_SECRET`: From Stream Dashboard
    - `CLIENT_URL`: **IMPORTANT** - Set this to your exact *Frontend URL*. Do not use `*` because credentialed CORS requests reject wildcard origins.
    - `NODE_ENV`: `production`

     - `VITE_GOOGLE_AI_API_KEY`: Optional Gemini API key for AI assistant features
6.  Click **Create Web Service**. Wait for the build to finish.
7.  **Copy your Backend URL** (e.g., `https://codeflow-backend.onrender.com`).

## 3. Deploy Frontend (Vercel)

Vercel is optimized for Vite/React apps.

1.  Log in to [Vercel Dashboard](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.

3. **Code execution runtime**:
    - The current executor launches `node`, `python`, `g++`, and `java` directly.
    - Your backend host must provide all four runtimes for all language buttons to work.
    - A standard Node-only host may support JavaScript but fail Python, C++, or Java.
    - Verify the deployment image has Node.js, Python, MinGW/g++, and JDK installed before deploying this version.
4.  **Configure Project**:
    - **Framework Preset**: Vite (should detect auto)
    - **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk Key
    - `VITE_API_URL`: `https://your-backend-url.onrender.com/api` (The URL from Step 2 + `/api`)
    - `VITE_STREAM_API_KEY`: Your Stream Key
6.  Click **Deploy**.

## 4. Final Configuration

1.  **Update Backend CORS**: Go back to Render -> Environment Variables. Update `CLIENT_URL` to your new Vercel Frontend URL (e.g., `https://codeflow-frontend.vercel.app`).
    - *Note: Making changes in Render triggers a redeploy.*
2.  **Update Clerk/Stream**:
    - Add your Vercel URL to "Allowed Origins" in Clerk Dashboard.
    - Check usage settings in Stream.


## Troubleshooting

- **Whiteboard Connection**: If Real-time sync fails, ensure `VITE_API_URL` is correct. The socket connects to the root of that URL.
- **CORS Errors**: Check `CLIENT_URL` in Backend and strictly match the Frontend URL (no trailing slash usually).
