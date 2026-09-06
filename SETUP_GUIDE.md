# CodeFlow - Environment Setup Guide
...
4. You should see the enhanced CodeFlow platform!

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with these variables:

```bash
# Clerk Authentication (Required)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# Backend API
VITE_API_URL=http://localhost:3000/api

# Stream Video/Chat
VITE_STREAM_API_KEY=your_stream_api_key_here

# Optional: Feature Flags
VITE_ENABLE_AI_FEATURES=false
VITE_ENABLE_VOICE_COMMANDS=false
VITE_ENABLE_ANALYTICS=true
```

## Backend Environment Variables

Create a `.env` file in the `backend` directory with these variables:

```bash
PORT=3000
NODE_ENV=development

# MongoDB
DB_URL=mongodb://localhost:27017/talent-iq

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Stream (Video/Chat)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

CLIENT_URL=http://localhost:5173

# Optional: AI Integration
# OPENAI_API_KEY=your_openai_api_key
# GOOGLE_AI_API_KEY=your_google_ai_api_key
# AI_PROVIDER=openai
```

## How to Get API Keys

### 1. Clerk (Authentication) - **Required**
1. Go to https://clerk.com
2. Sign up for a free account
3. Create a new application
4. Copy the Publishable Key and Secret Key from the dashboard
5. Add them to both frontend and backend `.env` files

### 2. Stream (Video/Chat) - **Required for video features**
1. Go to https://getstream.io
2. Sign up for a free account
3. Create a new app
4. Get your API Key and Secret
5. Add them to both `.env` files

### 3. MongoDB - **Required for backend**
- **Option 1**: Install MongoDB locally
  - Download from https://www.mongodb.com/try/download/community
  - Use connection string: `mongodb://localhost:27017/talent-iq`

- **Option 2**: Use MongoDB Atlas (Cloud)
  - Go to https://www.mongodb.com/cloud/atlas
  - Create a free cluster
  - Get your connection string

### 4. Inngest (Background Jobs) - **Required for backend**
1. Go to https://www.inngest.com
2. Sign up for a free account
3. Get your Event Key and Signing Key
4. Add them to backend `.env`

### 5. AI Features (Optional)
- **OpenAI**: Get API key from https://platform.openai.com
- **Google Gemini**: Get API key from https://makersuite.google.com/app/apikey

## Quick Start (Without Full Setup)

If you want to see the UI without setting up all services:

1. **Minimum Required**: Just add Clerk keys to frontend `.env`:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   VITE_API_URL=http://localhost:3000/api
   VITE_STREAM_API_KEY=dummy_key
   ```

2. The frontend will load and you can see all the UI enhancements
3. Some features (video calls, sessions) won't work without backend setup

## After Adding Keys

1. Stop the dev servers (Ctrl+C in both terminals)
2. Restart them:
   ```bash
   # Terminal 1 - Frontend
   cd frontend
   npm run dev

   # Terminal 2 - Backend  
   cd backend
   npm run dev
   ```

3. Open http://localhost:5173 in your browser
4. You should see the enhanced Talent IQ platform!

## What Works Without Backend

Even without backend setup, you can explore:
- ✅ Homepage with modern design
- ✅ Dark mode toggle
- ✅ All UI animations and effects
- ✅ Navigation between pages
- ❌ User authentication (needs Clerk)
- ❌ Creating/joining sessions (needs backend)
- ❌ Video calls (needs Stream)
