# Complete Setup Guide for finfeed

This guide will walk you through the complete setup process from scratch.

## Step 1: API Keys Setup

### NewsAPI.org Setup

1. Visit [https://newsapi.org/register](https://newsapi.org/register)
2. Sign up for a free account
3. Verify your email address
4. Login and navigate to your account dashboard
5. Copy your API key (it should look like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
6. Note: Free tier has 100 requests/day limit

### Google Gemini API Setup

1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select "Create API key in new project" or choose an existing project
5. Copy your API key (format: `AIzaSy...`)
6. Save this key securely

## Step 2: Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter project name (e.g., "finfeed")
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create project" and wait for setup to complete

### Enable Authentication

1. In Firebase Console, click on "Authentication" in the left sidebar
2. Click "Get Started"
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first toggle (Email/Password)
6. Click "Save"

### Create Firestore Database

1. In Firebase Console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a Cloud Firestore location (select closest to your users)
5. Click "Enable"
6. Go to "Rules" tab and you'll update these later via deployment

### Get Firebase Configuration

1. In Firebase Console, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>`
5. Register your app with a nickname (e.g., "finfeed Web")
6. Don't check "Firebase Hosting" yet
7. Copy the configuration object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc..."
};
```

## Step 3: Local Project Setup

### Install Dependencies

```bash
cd finfeed
npm install
```

### Create .env File

Create a `.env` file in the root directory:

```bash
touch .env
```

Open `.env` and add all your credentials:

```env
# Firebase Configuration (from Step 2)
VITE_FIREBASE_API_KEY=AIza...your-actual-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...

# API Keys (from Step 1)
VITE_NEWS_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_GEMINI_API_KEY=AIzaSy...your-gemini-key
```

**Important**: 
- Replace ALL placeholder values with your actual credentials
- Do NOT commit this file to Git (it's in .gitignore)
- Make sure there are NO spaces around the `=` sign
- All keys should start with `VITE_` for Vite to recognize them

### Update Firebase Project ID

Edit `.firebaserc`:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

Replace `your-actual-project-id` with your Firebase project ID from Step 2.

## Step 4: Test Locally

Start the development server:

```bash
npm run dev
```

You should see:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser to `http://localhost:5173/`

### Test Features

1. **Signup**: Create a new account with email/password
2. **Login**: Login with your credentials
3. **Search**: Search for a company (e.g., "Tesla", "Apple")
4. **Sentiment**: Verify sentiment badges appear on articles
5. **Infinite Scroll**: Scroll down to load more articles
6. **Save**: Click "Save All Articles" button
7. **Saved Articles**: Navigate to Saved section
8. **Refresh**: Test refresh button on saved company
9. **Dark Mode**: Toggle dark/light mode
10. **Logout**: Logout and verify redirect to login

## Step 5: Firebase Deployment Setup

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Login to Firebase

```bash
firebase login
```

This will open your browser. Login with the same Google account used in Firebase Console.

### Verify Configuration

Firebase configuration is already set up in the project. Verify these files exist:

- `firebase.json` - Hosting and Firestore configuration
- `firestore.rules` - Security rules
- `.firebaserc` - Project ID (you updated this in Step 3)

### Deploy Security Rules

Before first use, deploy Firestore security rules:

```bash
firebase deploy --only firestore:rules
```

This ensures users can only access their own data.

## Step 6: Production Build & Deploy

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Or use the npm script:

```bash
npm run deploy:hosting
```

### Get Your Live URL

After deployment succeeds, you'll see:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

Your app is now live at the Hosting URL!

## Step 7: Verify Production Deployment

1. Visit your Hosting URL
2. Test all features in production:
   - User signup/login
   - Search functionality
   - Article saving
   - All navigation
3. Check Firebase Console → Authentication for new users
4. Check Firestore Database for saved articles

## Troubleshooting

### "API key not valid" Error

- Double-check your `.env` file has correct API keys
- Ensure all keys start with `VITE_`
- Restart the dev server after changing `.env`

### Firebase Configuration Errors

- Verify all Firebase config values in `.env`
- Ensure Firebase project is created and services enabled
- Check `.firebaserc` has correct project ID

### NewsAPI Rate Limit

- Free tier: 100 requests/day
- Each search counts as 1-2 requests
- Consider upgrading or implementing caching

### Firestore Permission Denied

- Deploy security rules: `firebase deploy --only firestore:rules`
- Verify user is authenticated
- Check Firebase Console → Firestore → Rules

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Dark Mode Not Persisting

- Check browser localStorage is enabled
- Try different browser
- Clear browser cache

## Environment Variables Checklist

✅ VITE_FIREBASE_API_KEY - From Firebase Console → Project Settings  
✅ VITE_FIREBASE_AUTH_DOMAIN - From Firebase Config  
✅ VITE_FIREBASE_PROJECT_ID - Your Firebase Project ID  
✅ VITE_FIREBASE_STORAGE_BUCKET - From Firebase Config  
✅ VITE_FIREBASE_MESSAGING_SENDER_ID - From Firebase Config  
✅ VITE_FIREBASE_APP_ID - From Firebase Config  
✅ VITE_NEWS_API_KEY - From NewsAPI.org Dashboard  
✅ VITE_GEMINI_API_KEY - From Google AI Studio  

## Security Best Practices

1. **Never** commit `.env` file to Git
2. **Never** share API keys publicly
3. Keep `.env.example` updated (without real keys)
4. Regenerate keys if accidentally exposed
5. Use Firebase security rules to protect data
6. Implement rate limiting if needed
7. Monitor Firebase usage in console

## Next Steps

1. Customize styling/branding
2. Add more companies to search
3. Implement article caching
4. Add user preferences
5. Set up custom domain
6. Add analytics
7. Implement search history
8. Add date range filtering

## Support

If you encounter issues:

1. Check this guide carefully
2. Review console errors (F12 in browser)
3. Check Firebase Console for errors
4. Verify all environment variables
5. Test with fresh browser/incognito mode
6. Check GitHub issues

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Firebase authentication enabled
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Build succeeds without errors
- [ ] All features tested locally
- [ ] Dark mode works correctly
- [ ] Mobile responsive design verified
- [ ] API rate limits understood
- [ ] Error handling tested
- [ ] Deployment successful
- [ ] Production URL accessible
- [ ] All features work in production

Congratulations! finfeed is now live! 🎉
