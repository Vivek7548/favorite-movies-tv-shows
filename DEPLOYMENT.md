# Deployment Guide

This guide covers deploying the Favorite Movies & TV Shows application to various platforms.

## Prerequisites

- GitHub account
- Node.js 18+ installed locally
- Git configured on your machine

---

## Step 1: Upload to GitHub

### 1.1 Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name: `favorite-movies-tv-shows` (or your preferred name)
4. Make it **Public** (required for free deployment)
5. Initialize WITHOUT README (we already have one)
6. Click **Create repository**

### 1.2 Push Code to GitHub

Open PowerShell in your project root and run:

```powershell
# Initialize git (if not already done)
git init

# Add all files (respects .gitignore)
git add .

# Commit
git commit -m "Initial commit: Favorite Movies & TV Shows app"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Change branch name to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Result**: Your code is now on GitHub! ✅

---

## Step 2: Deploy Backend

### Option A: Deploy to Render.com (Recommended - Free Tier)

**Why Render?** 
- Free tier includes 750 hours/month
- Easy to use
- Excellent for Node.js apps
- Built-in database support

#### Steps:

1. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub (easier)
   - Click "Connect GitHub"

2. **Create New Web Service**
   - Dashboard → **New** → **Web Service**
   - Connect your GitHub repo
   - Select the repository

3. **Configure Web Service**
   - **Name**: `favorite-movies-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run prisma:generate`
   - **Start Command**: `npm run start`
   - **Root Directory**: `backend` (important!)

4. **Add Environment Variables**
   - Click **Environment**
   - Add these variables:
   ```
   DATABASE_URL=mysql://user:password@host:3306/favorite_movies
   PORT=4000
   NODE_ENV=production
   ```

   **For the DATABASE_URL**, you have 2 options:
   
   **Option 1: Use Render MySQL Database (Recommended)**
   - Click **Create Database** in Render
   - It will provide the connection string
   - Copy-paste it into DATABASE_URL
   
   **Option 2: Use External MySQL**
   - Provide your own MySQL credentials
   - Make sure your database is accessible from the internet

5. **Deploy**
   - Click **Create Web Service**
   - Wait for deployment (2-3 minutes)
   - Copy the URL (e.g., `https://favorite-movies-backend.onrender.com`)

6. **Test Backend**
   - Visit `https://your-render-url.onrender.com/health`
   - Should see: `{"status":"ok"}`

**Backend URL**: Keep this, you'll need it for frontend! 📝

---

### Option B: Deploy to Railway.app

1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → Deploy from GitHub repo
4. Add environment variables (same as above)
5. Click Deploy

---

## Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended - Free)

**Why Vercel?**
- Made by Nextjs creators
- Excellent for React/Vite apps
- Automatic deployments on git push
- Free tier is generous

#### Steps:

1. **Visit Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign up"
   - Select "Continue with GitHub"
   - Authorize Vercel to access your GitHub

2. **Create New Project**
   - Click **Add New**
   - Select **Project**
   - Find and import your repository

3. **Configure Project**
   - **Framework Preset**: Select `Vite`
   - **Root Directory**: Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variable**
   - Under **Environment Variables**, add:
   ```
   VITE_API_BASE=https://your-render-backend-url.onrender.com
   ```
   (Replace with your actual backend URL from Step 2)

5. **Deploy**
   - Click **Deploy**
   - Wait 1-2 minutes
   - Get your frontend URL (e.g., `https://favorite-movies.vercel.app`)

6. **Test Frontend**
   - Visit your Vercel URL
   - Verify you can see the app and create/edit/delete favorites

**Frontend is Live!** 🎉

---

### Option B: Deploy to Netlify

1. Visit [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Select repository and `frontend` directory
5. Add same environment variable as Vercel
6. Deploy

---

## Step 4: Update Configuration After Deployment

After deploying both services, you may need to update:

### 4.1 Update Frontend Environment

If your backend URL changes, update in Vercel:
1. Vercel Dashboard → Your Project
2. Settings → **Environment Variables**
3. Update `VITE_API_BASE` to new backend URL
4. Trigger redeploy (push to main branch or click redeploy)

### 4.2 Enable CORS (if needed)

If you get CORS errors, ensure your backend has CORS enabled:

In `backend/src/index.js`:
```javascript
const cors = require('cors');
app.use(cors()); // This should already be set
```

---

## Database Migration in Production

### First-time Setup

After deployment, run migrations:

**For Render:**
1. Go to your Render service
2. Click **Shell** tab
3. Run:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

**For Railway:**
- Similar process in Railway console

### Seed Sample Data

```bash
npm run prisma:seed
```

This will add sample movies (Inception, Breaking Bad) to your database.

---

## Monitoring & Maintenance

### View Logs

**Render:**
- Dashboard → Your Service → **Logs**

**Vercel:**
- Dashboard → Your Project → **Deployments** → Click deployment → **Logs**

### Common Issues

**1. Backend Not Found (404)**
- Verify backend URL in frontend environment variables
- Check backend is running: visit `/health` endpoint

**2. Database Connection Error**
- Verify DATABASE_URL is correct
- Check MySQL server is accessible
- Ensure firewall allows connections

**3. Port Already in Use**
- Render/Vercel assigns ports automatically
- Don't hardcode ports in production

**4. Node Modules Too Large**
- Make sure `.gitignore` includes `node_modules/`
- Deployment services install dependencies automatically

---

## Summary

| Service | Type | Cost | URL |
|---------|------|------|-----|
| Render | Backend Hosting | Free | `https://your-service.onrender.com` |
| Vercel | Frontend Hosting | Free | `https://your-project.vercel.app` |
| MySQL | Database | Varies | Provided by Render or external |

---

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Database configured and migrated
- [ ] Sample data seeded
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set to backend URL
- [ ] Tested full CRUD operations
- [ ] Verified `/health` endpoint works
- [ ] Verified frontend can reach backend

---

## Support

For issues:
1. Check deployment service logs
2. Verify environment variables
3. Test backend health endpoint
4. Check browser console for errors
5. Review this guide's troubleshooting section

Good luck with your deployment! 🚀