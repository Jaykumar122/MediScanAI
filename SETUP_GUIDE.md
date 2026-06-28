# MediScan AI - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- OAuth credentials (Google, GitHub, Apple)

---

## 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/securerx
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securerx

# JWT Secret (must be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long

# App URL (for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Or production:
# NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Apple OAuth (optional)
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
```

---

## 2. OAuth Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" → "Credentials"
4. Create "OAuth 2.0 Client ID"
5. Add authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env.local`

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Application name: MediScan AI
   - Homepage URL: `http://localhost:3000` (or your domain)
   - Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
4. Copy Client ID and generate Client Secret
5. Add to `.env.local`

### Apple OAuth Setup

1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a Service ID
3. Configure Sign in with Apple
4. Add redirect URI: `https://yourdomain.com/api/auth/apple/callback`
5. Add to `.env.local`

---

## 3. Database Setup

### Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS:
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or run manually:
mongod --dbpath /path/to/data/directory
```

### MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist your IP address (or 0.0.0.0/0 for development)
5. Get connection string and update `.env.local`

---

## 4. Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

---

## 5. Running the Application

### Development Mode

```bash
npm run dev
```

Visit `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## 6. Create Admin User

There are two ways to create an admin user:

### Option 1: Direct Database Insert

Connect to MongoDB and run:

```javascript
db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@mediscanai.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "admin",
  status: "active",
  provider: "local",
  createdAt: new Date(),
  isAdmin: true,
  isVerified: true
})
```

### Option 2: Sign Up and Promote

1. Sign up normally through the web interface
2. Connect to database and update the user:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin", isAdmin: true } }
)
```

---

## 7. Verify Installation

### Test OAuth Flow

1. Go to signup page: `http://localhost:3000/signup`
2. Click "Sign in with Google/GitHub/Apple"
3. Complete OAuth flow
4. You should see role selection page
5. Choose a role and continue
6. You should be redirected to appropriate dashboard

### Test Admin Dashboard

1. Log in as admin user
2. Navigate to: `http://localhost:3000/dashboard/admin`
3. You should see:
   - User statistics
   - Recent users table
   - Recent prescriptions table

### Test Admin API

```bash
# Get admin token (from browser localStorage)
TOKEN="your-jwt-token-here"

# Test dashboard stats
curl -X GET http://localhost:3000/api/dashboard/admin \
  -H "Authorization: Bearer $TOKEN"

# Test analytics
curl -X GET http://localhost:3000/api/dashboard/admin/analytics \
  -H "Authorization: Bearer $TOKEN"

# Test users list
curl -X GET http://localhost:3000/api/dashboard/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. Common Issues & Solutions

### "redirect_uri_mismatch" Error

**Problem:** OAuth provider rejects the redirect URI

**Solution:**
1. Ensure `NEXT_PUBLIC_APP_URL` matches your domain
2. Check OAuth app settings match exactly:
   - `http://localhost:3000/api/auth/{provider}/callback` (dev)
   - `https://yourdomain.com/api/auth/{provider}/callback` (prod)
3. No trailing slashes in URLs

### "Failed to load dashboard data"

**Problem:** Admin dashboard shows error

**Solution:**
1. Check user has `role: "admin"` in database
2. Verify JWT token is valid
3. Check browser console for errors
4. Verify API route is working:
   ```bash
   curl http://localhost:3000/api/dashboard/admin \
     -H "Authorization: Bearer $TOKEN"
   ```

### MongoDB Connection Error

**Problem:** Cannot connect to database

**Solution:**
1. Verify MongoDB is running: `mongosh` or `mongo`
2. Check `MONGODB_URI` in `.env.local`
3. For Atlas: whitelist IP address
4. Check network connectivity

### JWT Secret Error

**Problem:** "JWT_SECRET is missing or shorter than 32 characters"

**Solution:**
1. Ensure `.env.local` exists
2. Add `JWT_SECRET` with at least 32 characters:
   ```env
   JWT_SECRET=this-is-a-very-long-secret-key-minimum-32-characters
   ```
3. Restart development server

---

## 9. Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── role-selection/    # NEW: OAuth role selection
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [provider]/
│   │   │   │   ├── route.ts
│   │   │   │   └── callback/route.ts
│   │   │   └── complete-oauth/  # NEW: Complete OAuth signup
│   │   └── dashboard/
│   │       └── admin/
│   │           ├── route.ts         # Dashboard stats
│   │           ├── users/route.ts   # User management
│   │           ├── doctors/route.ts
│   │           ├── pharmacy/route.ts
│   │           ├── team/route.ts
│   │           ├── analytics/route.ts  # NEW
│   │           ├── activity/route.ts   # NEW
│   │           └── settings/route.ts   # NEW
│   └── dashboard/
│       └── admin/
│           └── page.tsx
├── lib/
│   ├── auth/
│   │   ├── oauth.ts       # UPDATED: Dynamic redirect URIs
│   │   ├── user.ts        # UPDATED: No auto-role assignment
│   │   └── ...
│   ├── admin/             # NEW
│   │   ├── middleware.ts  # Auth helpers
│   │   └── utils.ts       # Utility functions
│   └── crypto.ts          # UPDATED: Support temp tokens
└── models/
    └── usermodels.ts
```

---

## 10. Next Steps

### Implement Features

- [ ] Email notifications for user actions
- [ ] Two-factor authentication
- [ ] Advanced analytics dashboard UI
- [ ] Export data functionality
- [ ] Audit logging system
- [ ] Role-based permissions (fine-grained)

### Security Enhancements

- [ ] Rate limiting for API endpoints
- [ ] CSRF protection
- [ ] Content Security Policy headers
- [ ] API key authentication for external services

### Performance

- [ ] Redis caching for frequently accessed data
- [ ] Database indexing optimization
- [ ] CDN for static assets
- [ ] Image optimization

---

## 11. Development Tips

### Hot Reload Issues

If changes aren't reflecting:
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### Database Inspection

```bash
# Connect to MongoDB
mongosh

# Use database
use securerx

# View users
db.users.find().pretty()

# Count by role
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])
```

### Debugging JWT Tokens

Use [jwt.io](https://jwt.io) to decode and inspect tokens

### Check Environment Variables

```bash
# Print env vars (be careful with secrets!)
node -e "console.log(process.env)"
```

---

## 12. Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables on Vercel

Add all `.env.local` variables in:
Settings → Environment Variables

### Database for Production

Use MongoDB Atlas for production database

### OAuth Callback URLs

Update OAuth apps with production URLs:
- `https://yourdomain.com/api/auth/google/callback`
- `https://yourdomain.com/api/auth/github/callback`
- `https://yourdomain.com/api/auth/apple/callback`

---

## 13. Testing

### Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

### Manual Testing Checklist

- [ ] User signup (local)
- [ ] User login
- [ ] OAuth signup (Google)
- [ ] OAuth signup (GitHub)
- [ ] OAuth signup (Apple)
- [ ] Role selection page appears
- [ ] Admin dashboard loads
- [ ] User management works
- [ ] Analytics endpoint returns data
- [ ] Settings can be updated

---

## 14. Support

### Documentation

- [OAUTH_ADMIN_UPDATES.md](./OAUTH_ADMIN_UPDATES.md) - Complete feature documentation
- [Admin API README](./src/app/api/dashboard/admin/README.md) - API reference

### Troubleshooting

1. Check server logs
2. Check browser console
3. Verify environment variables
4. Test API endpoints with cURL
5. Check database data

---

## 15. License

This project is part of MediScan AI.

---

**Happy Coding! 🚀**
