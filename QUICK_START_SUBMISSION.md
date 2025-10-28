# Quick Start: From Local to Live in 4 Steps

TL;DR version of the submission process. Follow these 4 steps to deploy your app.

---

## Step 1️⃣: Push to GitHub (5 minutes)

```powershell
# Open PowerShell in project root
cd "f:\Favorite Movies & TV Shows"

# Initialize git (one time)
git init
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Create GitHub repo at github.com and copy URL

# Add files
git add .
git commit -m "Initial commit: Favorite Movies & TV Shows"
git remote add origin https://github.com/YOUR_USERNAME/favorite-movies-tv-shows.git
git branch -M main
git push -u origin main
```

✅ **GitHub:** https://github.com/YOUR_USERNAME/favorite-movies-tv-shows

---

## Step 2️⃣: Deploy Backend (10 minutes)

### Create Render Account
1. Visit [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize access

### Deploy Backend
1. Dashboard → **New Web Service**
2. Select your repository
3. Configure:
   - **Name**: `favorite-movies-backend`
   - **Root Directory**: `backend`
   - **Build**: `npm install && npm run prisma:generate`
   - **Start**: `npm run start`

4. **Environment Variables**:
   ```
   DATABASE_URL=mysql://user:password@host:3306/db
   NODE_ENV=production
   ```
   
   💡 **Tip**: Click "Create Database" in Render for auto MySQL setup

5. Click **Deploy** and wait 2-3 minutes

✅ **Backend URL**: Copy from Render dashboard (e.g., `https://favorite-movies-backend.onrender.com`)

### Run Migrations
1. Render Dashboard → Your Service → **Shell**
2. Run:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

---

## Step 3️⃣: Deploy Frontend (5 minutes)

### Create Vercel Account
1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize access

### Deploy Frontend
1. **Add New** → **Project**
2. Select your repository
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output**: `dist`

4. **Environment Variable**:
   ```
   VITE_API_BASE=https://your-backend-url.onrender.com
   ```
   (Use your actual backend URL from Step 2)

5. Click **Deploy** and wait 1-2 minutes

✅ **Frontend URL**: Copy from Vercel dashboard (e.g., `https://favorite-movies.vercel.app`)

---

## Step 4️⃣: Test & Verify (5 minutes)

### Test Backend
```
Visit: https://your-backend-url.onrender.com/health
Expected: {"status":"ok"}
```

### Test Frontend
1. Visit: `https://your-frontend-url.vercel.app`
2. Add a movie
3. Edit it
4. Delete it
5. Refresh page - changes should persist

✅ **All working!**

---

## 🎉 You're Done! Submission URLs:

Save these for your submission:

```
GitHub:   https://github.com/YOUR_USERNAME/favorite-movies-tv-shows
Frontend: https://your-frontend-url.vercel.app
Backend:  https://your-backend-url.onrender.com
```

---

## 📚 Detailed Guides

Need more details? Check these:

- **GitHub Issues?** → [GITHUB_SETUP.md](./GITHUB_SETUP.md)
- **Deployment Issues?** → [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Full Checklist?** → [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md)
- **Backend Help?** → [backend/README.md](./backend/README.md)
- **Frontend Help?** → [frontend/README.md](./frontend/README.md)

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "fatal: not a git repository" | Run `git init` first |
| "Permission denied" | Use HTTPS instead of SSH |
| Backend shows 500 error | Check DATABASE_URL in Render env vars |
| Frontend can't reach backend | Verify VITE_API_BASE in Vercel env vars |
| "Insufficient permissions" | Database user needs CREATE/ALTER rights |

---

**Estimated Time: 30 minutes total** ⏱️

**Next Step**: Start with Step 1 (GitHub push)! 🚀