# 🔧 HEROKU CLI - TROUBLESHOOTING GUIDE

**Problem:** Script says "checking heroku CLI" and hangs or fails  
**Cause:** Heroku CLI is likely not installed  
**Solution:** Follow steps below

---

## ⚡ QUICK FIX (5 MINUTES)

### Option 1: Install Heroku CLI (RECOMMENDED)

**Step 1: Download Heroku CLI**
- Go to: https://devcenter.heroku.com/articles/heroku-cli
- Look for: **Windows** section
- Click: **Download** button (should say "Heroku-x64.exe" or similar)

**Step 2: Install It**
- Find downloaded file (usually in Downloads folder)
- Double-click the `.exe` file
- Click "Install"
- Click "Next" through all prompts
- Click "Finish"

**Step 3: RESTART YOUR COMPUTER**
- This is important! Restart so PATH updates

**Step 4: Open New Command Prompt**
- Close old one
- Windows Key + R → cmd → Enter

**Step 5: Test Installation**
```bash
heroku --version
```
- Should show: `heroku/7.x.x` or similar version number
- If you see version number: ✅ SUCCESS!

**Step 6: Try Deployment Again**
```bash
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM" && DEPLOY_HEROKU.bat
```

---

### Option 2: Use npm to Install Heroku CLI

**If Option 1 doesn't work, try this:**

**Step 1: Open Command Prompt**
```bash
Windows Key + R → cmd → Enter
```

**Step 2: Install via npm**
```bash
npm install -g heroku
```

**Step 3: Wait for installation** (~2-3 minutes)

**Step 4: Test**
```bash
heroku --version
```

**Step 5: Try Deployment**
```bash
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM" && DEPLOY_HEROKU.bat
```

---

## 🔍 VERIFY HEROKU IS INSTALLED

**Run these commands to check:**

```bash
heroku --version
```

**Expected Result:**
```
heroku/7.68.0 win32-x64 node-v18.15.0
```

**If you see:**
- ✅ Version number → Heroku is installed
- ❌ "command not found" → Heroku NOT installed
- ❌ Nothing happens → Script can't find it

---

## ✅ COMPLETE TROUBLESHOOTING STEPS

### Step 1: Verify Node/npm Installed
```bash
node --version
npm --version
```

Should show version numbers like:
- `v18.x.x`
- `9.x.x`

If not: Install Node.js from https://nodejs.org

---

### Step 2: Install Heroku CLI via npm
```bash
npm install -g heroku
```

Wait for completion (should see "added X packages")

---

### Step 3: Verify Heroku Installed
```bash
heroku --version
```

Should show version number (e.g., `heroku/7.68.0`)

---

### Step 4: Login to Heroku
```bash
heroku login
```

Browser will open → Login with your Heroku account

---

### Step 5: Try Deployment Again
```bash
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
DEPLOY_HEROKU.bat
```

Should now work!

---

## 🆘 IF STILL STUCK

### Issue: Script hangs on "Checking Heroku CLI"

**Solution 1: Kill the script**
```
Press: Ctrl + C (in Command Prompt)
```

**Solution 2: Check PATH**
```bash
where heroku
```

Should show path like: `C:\Users\Lenovo\AppData\npm\heroku`

If "command not found" → Heroku not in PATH

**Solution 3: Reinstall Heroku**
1. Uninstall: Go to Control Panel → Programs → Uninstall (find Heroku)
2. Reinstall from: https://devcenter.heroku.com/articles/heroku-cli
3. Restart computer
4. Try again

---

## 📋 MANUAL DEPLOYMENT (If Script Still Fails)

If the script keeps failing, deploy manually:

```bash
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"

heroku login

heroku create your-app-name

heroku config:set NODE_ENV=production

git add .

git commit -m "Deploy to Heroku"

git push heroku master

heroku open
```

Follow prompts and replace `your-app-name` with your unique name.

---

## ✅ FINAL VERIFICATION

After installation, you should be able to run:

```bash
heroku --version
heroku login
heroku apps
```

All three should work without errors.

Then deployment script should work:

```bash
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM" && DEPLOY_HEROKU.bat
```

---

## 📞 IF ALL ELSE FAILS

**Contact Heroku Support:**
- https://help.heroku.com
- Or email: support@heroku.com

**Or try alternative deployment:**
- Read: `DEPLOYMENT_READY_FINAL.md` (section on manual deployment)

---

**Once Heroku CLI is installed, deployment is 100% automated!** 🚀
