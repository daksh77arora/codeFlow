# Quick Backend Setup for Session Creation

## What You Need

To create sessions, the backend needs these API keys:

### 1. ✅ Clerk Keys (Partially Done)
You already have the publishable key. Now get the **Secret Key**:
1. Go to your Clerk dashboard: https://dashboard.clerk.com
2. Select your application
3. Go to **API Keys**
4. Copy the **Secret Key** (starts with `sk_test_...`)

### 2. 🎥 Stream Keys (Required for Video/Chat)
1. Go to https://getstream.io
2. Sign up for FREE account
3. Create a new app
4. Go to **Dashboard** → **App Settings**
5. Copy:
   - **API Key**
   - **API Secret**

### 3. 💾 MongoDB (Required for Database)

**Option A: Local MongoDB (Fastest)**
1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Install it
3. Use connection string: `mongodb://localhost:27017/talent-iq`

**Option B: MongoDB Atlas (Cloud - Easier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for FREE tier
3. Create a cluster (takes 3-5 minutes)
4. Click **Connect** → **Connect your application**
5. Copy the connection string
6. Replace `<password>` with your database password

### 4. ⚡ Inngest Keys (Required for Background Jobs)
1. Go to https://www.inngest.com
2. Sign up for FREE account
3. Create a new app
4. Go to **Keys** section
5. Copy:
   - **Event Key**
   - **Signing Key**

## Create Backend .env File

Once you have the keys, create `.env` file in the `backend` folder:

```bash
PORT=3000
NODE_ENV=development

# MongoDB - Use one of these:
DB_URL=mongodb://localhost:27017/talent-iq
# OR for Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/talent-iq

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here

# Stream
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_ZWxlZ2FudC1nYXJmaXNoLTY1LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=your_clerk_secret_key_here

CLIENT_URL=http://localhost:5173
```

## Restart Backend

After creating the `.env` file:

1. Stop the backend server (Ctrl+C)
2. Run: `npm run dev`
3. You should see: "Server is running on port: 3000"

## Test Session Creation

1. Go to http://localhost:5173
2. Sign in with Clerk
3. Go to Dashboard
4. Click "Create New Session"
5. It should work! 🎉

## Minimum to Get Started

If you want to test quickly, you can use:
- **MongoDB**: Local installation (fastest)
- **Clerk**: You already have this
- **Stream**: Free account (5 minutes to setup)
- **Inngest**: Free account (2 minutes to setup)

Total setup time: **~15 minutes**

## What Works Without Backend

Currently working (frontend only):
- ✅ All UI enhancements
- ✅ Dark mode
- ✅ Navigation
- ✅ Viewing pages

Needs backend:
- ❌ Creating sessions
- ❌ Joining sessions
- ❌ Video calls
- ❌ Chat
