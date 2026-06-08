# 🚀 EXECUTE NOW - Get Your System Online

## ⚡ Fastest Way - Run This Batch File

**Double-click this file:**
```
setup-and-run.bat
```

**What it does:**
1. ✅ Installs all dependencies
2. ✅ Seeds initial data into MongoDB
3. ✅ Starts the development server
4. ✅ Opens http://localhost:3000 and http://localhost:5000

**Total time: ~10 minutes**

---

## 🛠️ Manual Setup (If Batch File Doesn't Work)

### Option A: Command Prompt (cmd.exe)

**Step 1: Open Command Prompt and run:**
```cmd
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
npm install
```

**Step 2: After installation completes:**
```cmd
npm run seed
```

**Step 3: Start the server (keep this running):**
```cmd
npm run dev
```

**Step 4: Open new Command Prompt and run tests:**
```cmd
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
npm run test:api
```

---

### Option B: PowerShell

**Step 1: Open PowerShell as Administrator**

**Step 2: Run setup script:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM\setup-and-run.ps1
```

---

## 📊 What Happens

### After `npm install`:
```
added 500+ packages in 5 minutes
```

### After `npm run seed`:
```
✅ Seeded 6 paint types
✅ Seeded 4 sample products
✅ Seeded 4 sample saved paints

📊 Database Summary:
   - Paint Types: 6
   - Products: 4
   - Saved Paints: 4
```

### After `npm run dev`:
```
✅ MongoDB connected successfully
Server running on http://localhost:5000
Frontend running on http://localhost:3000
```

### After `npm run test:api`:
```
✅ Health Check
✅ Paint Types: GET
✅ Paint Types: POST
✅ Paint Types: DELETE
✅ Products: GET
✅ Products: POST
✅ Products: GET by ID
✅ Products: PUT
✅ Products: DELETE
✅ Products: Save QR
✅ Saved Paints: GET
✅ Saved Paints: POST
✅ Saved Paints: Favorite Toggle
✅ Saved Paints: DELETE

📊 Test Results: 14 passed, 0 failed
```

---

## 🌐 Access Your System

After everything is running:

- **Frontend UI:** http://localhost:3000
- **API Health:** http://localhost:5000/api/health
- **MongoDB Data:** https://cloud.mongodb.com (your account)

---

## ✅ Troubleshooting

### "npm: command not found"
- Node.js is not installed
- Download from: https://nodejs.org/
- Install and restart terminal

### "Port 5000 already in use"
- Edit `.env` file
- Change `PORT=5000` to `PORT=5001`
- Restart server

### "MongoDB connection failed"
- Check `.env` has correct MONGODB_URI
- Verify MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas settings

### "EACCES permission denied"
- On macOS/Linux: Use `sudo npm install`
- On Windows: Run terminal as Administrator

---

## 🎯 QUICK COMMAND SUMMARY

```bash
# Install
npm install

# Seed data
npm run seed

# Start server (keep running)
npm run dev

# Test APIs (new terminal)
npm run test:api

# Just start server (no installation)
npm run dev

# Just test (if server already running)
npm run test:api
```

---

## 📋 CHECKLIST

After setup:

- [ ] `npm install` completed without errors
- [ ] `npm run seed` shows all data seeded
- [ ] Server starts with "MongoDB connected"
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:5000/api/health
- [ ] Tests show 14/14 passed
- [ ] Can see data in MongoDB Atlas

---

## 🚀 READY?

### Choose One:

**Option 1 - Automatic (Easiest)**
```
Double-click: setup-and-run.bat
```

**Option 2 - Manual Step by Step**
```
1. npm install
2. npm run seed
3. npm run dev (keep running)
4. npm run test:api (new terminal)
```

**Start now!** ⏱️
