# Quick Start Guide

## Prerequisites

You need these API keys before starting:

1. **NewsAPI.org Key** → [Get it here](https://newsapi.org/register)
2. **Google Gemini API Key** → [Get it here](https://makersuite.google.com/app/apikey)
3. **Firebase Project** → [Create one here](https://console.firebase.google.com/)

## 5-Minute Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_NEWS_API_KEY=your-newsapi-key
VITE_GEMINI_API_KEY=your-gemini-key
```

### 3. Firebase Setup (3 steps)

1. Enable **Authentication** → Email/Password
2. Create **Firestore Database** → Production mode
3. Copy Firebase config to `.env`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Test the App

1. **Sign up** with email/password
2. **Search** for "Tesla" or "Apple"
3. **Save** articles
4. Toggle **dark mode**

## Deploy to Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Update .firebaserc with your project ID

# Deploy
npm run deploy
```

## Common Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run deploy           # Build and deploy to Firebase
npm run deploy:hosting   # Deploy only hosting
npm run deploy:rules     # Deploy only Firestore rules
```

## Project Structure

```
src/
├── components/      # UI components (Login, Signup, Navigation, etc.)
├── pages/          # Page components (Home, SavedArticles)
├── contexts/       # React contexts (Auth, Theme)
├── services/       # API services (News, Sentiment, Firestore)
├── config/         # Configuration files
└── types/          # TypeScript types
```

## Features

✅ News search with NewsAPI  
✅ AI sentiment analysis (Gemini)  
✅ Infinite scroll  
✅ Save articles to Firestore  
✅ Dark mode  
✅ Email authentication  
✅ Responsive design  

## Need Help?

See detailed instructions in `SETUP_GUIDE.md`

## Environment Variables

All environment variables must start with `VITE_` prefix for Vite to recognize them.

Never commit `.env` file - it's in `.gitignore` for security.

## API Limits

- **NewsAPI Free**: 100 requests/day
- **Gemini API**: Check your quota in Google Cloud Console
- Consider implementing caching for production

## Troubleshooting

**Dev server not starting?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Firebase errors?**
- Check all environment variables
- Verify Firebase project is set up
- Deploy security rules: `npm run deploy:rules`

**Build errors?**
```bash
npm run build
# Check error message for missing dependencies
```

That's it! You're ready to go! 🚀
