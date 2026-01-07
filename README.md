# finfeed 📈

finfeed is a comprehensive, production-ready React web application for aggregating and analyzing stock news with AI-powered sentiment analysis.

## Features ✨

- **🔍 Smart Search**: Search for company stock news using NewsAPI.org
- **🤖 AI Sentiment Analysis**: Real-time sentiment prediction (bullish/bearish/neutral) using Google's Gemini API
- **♾️ Infinite Scroll**: Seamlessly load more articles as you scroll
- **💾 Save & Organize**: Save articles by company with Firestore
- **🔄 Refresh Functionality**: Update saved articles with latest news
- **🔐 Authentication**: Secure email/password authentication with Firebase
- **🌓 Dark Mode**: Toggle between light and dark themes with persistent preferences
- **📱 Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **⚡ Performance Optimized**: Lazy loading, debouncing, and efficient re-renders

## Tech Stack 🛠️

- **Frontend**: React 19 with TypeScript
- **Styling**: TailwindCSS with dark mode support
- **Routing**: React Router v6
- **Backend Services**:
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Hosting
- **APIs**:
  - NewsAPI.org for news articles
  - Google Gemini AI for sentiment analysis
- **Build Tool**: Vite
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

## Prerequisites 📋

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- NewsAPI.org API key
- Google Gemini API key

## Setup Instructions 🚀

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd finfeed
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# API Keys
VITE_NEWS_API_KEY=your-newsapi-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** → Email/Password provider
4. Enable **Cloud Firestore** → Create database in production mode
5. Copy your Firebase configuration to `.env`
6. Update `.firebaserc` with your project ID

### 5. Get API Keys

**NewsAPI.org**:
- Visit [https://newsapi.org/](https://newsapi.org/)
- Sign up for a free account
- Get your API key from the dashboard

**Google Gemini API**:
- Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Create an API key
- Copy to your `.env` file

## Development 💻

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build 🏗️

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Firebase Deployment 🚀

### First-time Setup

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login to Firebase:

```bash
firebase login
```

3. Initialize Firebase (already configured):

```bash
firebase init
```

Select:
- Hosting
- Firestore

### Deploy

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

Or deploy only hosting:

```bash
firebase deploy --only hosting
```

Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

## Project Structure 📁

```
finfeed/
├── src/
│   ├── components/         # React components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Navigation.tsx
│   │   ├── NewsCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LoadingModal.tsx
│   │   └── PrivateRoute.tsx
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── SavedArticles.tsx
│   │   └── ForgotPassword.tsx
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/          # API services
│   │   ├── newsService.ts
│   │   ├── sentimentService.ts
│   │   └── firestoreService.ts
│   ├── config/            # Configuration
│   │   ├── firebase.ts
│   │   └── api.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── .firebaserc           # Firebase project configuration
└── package.json          # Dependencies and scripts
```

## Features in Detail 📖

### Authentication
- Email/password signup with validation
- Secure login with error handling
- Password reset functionality
- Protected routes for authenticated users

### News Search
- Real-time company news search
- Initial load of 8-10 articles
- Infinite scroll for automatic loading
- Article metadata (source, date, image)

### Sentiment Analysis
- AI-powered sentiment prediction
- Color-coded badges (green/red/gray)
- Batch processing for efficiency
- Fallback to neutral on errors

### Saved Articles
- Save all displayed articles by company
- Organize by company name
- View article counts and last updated time
- Refresh to get latest news
- Delete individual companies or all

### Dark Mode
- System preference detection
- Toggle switch in navigation
- Persistent across sessions
- Full component support

## Security 🔒

- Firestore security rules ensure users can only access their own data
- API keys stored in environment variables
- Authentication required for all main features
- Secure password reset flow

## Performance Optimizations ⚡

- Lazy image loading
- Infinite scroll pagination
- React hooks optimization (useMemo, useCallback)
- Efficient re-renders
- API response handling with error boundaries

## Troubleshooting 🔧

**Build errors**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

**API rate limits**: NewsAPI free tier has rate limits. Consider caching or upgrading.

**Firestore permissions**: Ensure security rules are deployed correctly.

## License 📄

MIT License

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request.

## Support 💬

For issues or questions, please open a GitHub issue.
