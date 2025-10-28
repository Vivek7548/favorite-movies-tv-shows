# GitHub Setup & First Push

This guide walks you through uploading this project to GitHub for the first time.

## Step 1: Prepare Your Local Environment

### 1.1 Install Git (if not already installed)

**Windows:**
- Download from [git-scm.com](https://git-scm.com)
- Run installer and follow defaults
- Restart PowerShell after installation

**Verify installation:**
```powershell
git --version
```

### 1.2 Configure Git

Run these commands once:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email (should match your GitHub account).

---

## Step 2: Create GitHub Repository

### 2.1 Create Account (if needed)
- Visit [github.com](https://github.com)
- Sign up (free)
- Verify email

### 2.2 Create New Repository

1. Click the **+** icon in top-right corner
2. Select **New repository**
3. Fill in:
   - **Repository name**: `favorite-movies-tv-shows` (or any name you prefer)
   - **Description**: "Full-stack app for managing favorite movies and TV shows"
   - **Visibility**: Select **Public** (required for free deployment)
   - **Initialize without README** (we already have one)
   - Click **Create repository**

### 2.3 Copy Repository URL

After creating, you'll see a green **Code** button. Click it and copy the HTTPS URL:
```
https://github.com/YOUR_USERNAME/favorite-movies-tv-shows.git
```

---

## Step 3: Push Code to GitHub

Open **PowerShell** in your project root (`f:\Favorite Movies & TV Shows`) and run:

### 3.1 Initialize Git Repository

```powershell
git init
```

This creates a hidden `.git` folder to track your code.

### 3.2 Add All Files

```powershell
git add .
```

The `.gitignore` file automatically excludes unnecessary files like:
- `node_modules/`
- `.env` (secrets)
- Database files
- Build outputs

### 3.3 Create First Commit

```powershell
git commit -m "Initial commit: Favorite Movies & TV Shows application"
```

### 3.4 Add Remote Repository

```powershell
git remote add origin https://github.com/YOUR_USERNAME/favorite-movies-tv-shows.git
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3.5 Rename Branch (if needed)

GitHub uses `main` by default. If your local branch is `master`:

```powershell
git branch -M main
```

Check current branch:
```powershell
git branch
```

### 3.6 Push to GitHub

```powershell
git push -u origin main
```

This uploads all your code to GitHub! 🎉

---

## Step 4: Verify on GitHub

1. Go to `https://github.com/YOUR_USERNAME/favorite-movies-tv-shows`
2. You should see all your files and folders
3. README.md should be displayed on the page

---

## Step 5: Future Updates

After the first push, updating is simple:

```powershell
# Make changes to your code...

# Stage changes
git add .

# Commit with a message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

---

## Common Issues

### "fatal: not a git repository"

**Solution**: Run `git init` first in your project root.

### "Permission denied (publickey)"

**Solution**: Set up SSH key or use HTTPS with personal token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when pushing

### "error: src refspec main does not match any"

**Solution**: Ensure you've made at least one commit:
```powershell
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### ".gitignore not working"

**Solution**: Cache might be preventing it. Run:
```powershell
git rm -r --cached .
git add .
git commit -m "Update gitignore"
git push
```

---

## What Gets Uploaded

✅ **Uploaded to GitHub:**
- Source code (frontend & backend)
- Configuration files
- READMEs and documentation
- `.gitignore` file
- Package.json files

❌ **NOT Uploaded** (protected by .gitignore):
- `node_modules/` folders
- `.env` file (your secrets!)
- Database files (`dev.db`)
- Log files
- Build output (`dist/`)

---

## Next Steps

After pushing to GitHub:

1. **Deploy to Cloud**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Deploy backend to Render
   - Deploy frontend to Vercel

2. **Collaboration**
   - Share repository URL with team
   - Others can `git clone` to get local copy
   - Use branches for features: `git checkout -b feature/my-feature`

3. **Continuous Integration** (Optional)
   - Set up GitHub Actions
   - Auto-deploy on push
   - Run tests automatically

---

## Useful Git Commands

```powershell
# View current status
git status

# View commit history
git log

# View changes (before committing)
git diff

# Discard local changes
git restore .

# Create a new branch
git checkout -b feature/name

# Switch branches
git checkout main

# View all branches
git branch -a

# Delete a branch
git branch -d feature/name
```

---

## SSH Setup (Optional, More Secure)

If you want to avoid entering credentials every time:

1. Generate SSH key:
```powershell
ssh-keygen -t ed25519 -C "your.email@example.com"
```

2. Add to GitHub:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - GitHub Settings → SSH Keys → New SSH key
   - Paste and save

3. Update remote URL to SSH:
```powershell
git remote set-url origin git@github.com:YOUR_USERNAME/favorite-movies-tv-shows.git
```

---

Done! Your project is now on GitHub! 🚀

Next, follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy your application.