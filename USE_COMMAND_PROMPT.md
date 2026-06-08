# ✅ COMMAND PROMPT METHOD (RECOMMENDED)

**Problem:** Batch file closes before you can see messages  
**Solution:** Run from Command Prompt instead (keeps window open!)

---

## ⚡ BEST WAY - Run in Command Prompt (Recommended)

**This prevents the window from closing early!**

### Step 1: Open Command Prompt
```
Windows Key + R → type: cmd → press Enter
```

### Step 2: Copy & Paste BOTH Lines:

```bash
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
```

Press Enter.

Then paste:

```bash
npm install -g heroku
```

Press Enter and wait 2-3 minutes.

### Step 3: Verify

```bash
heroku --version
```

Should show: `heroku/7.x.x` ✅

### Step 4: Deploy

```bash
DEPLOY_HEROKU.bat
```

Your system goes live! 🚀

---

## WHY THIS WORKS BETTER

**Batch file double-click:**
- ❌ Closes quickly if error
- ❌ Hard to see messages
- ❌ Can't interact easily

**Command Prompt directly:**
- ✅ Stays open always
- ✅ See all messages
- ✅ Can interact and fix issues
- ✅ Better control

---

## FULL COMMAND SEQUENCE

Copy each line one at a time into Command Prompt:

```bash
cd "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
```
Press Enter, then:

```bash
npm install -g heroku
```
Wait 2-3 minutes, then:

```bash
heroku --version
```
Should show version, then:

```bash
heroku login
```
Login in browser (or skip if already logged in), then:

```bash
DEPLOY_HEROKU.bat
```
Wait 5-10 minutes for deployment!

---

## IF npm IS NOT FOUND

If you see "npm: command not found", Node.js isn't installed:

1. Download Node.js: https://nodejs.org
2. Install it
3. Restart computer
4. Try again

---

## FINAL STEP - DEPLOY

Once you've verified Heroku is installed, run:

```bash
DEPLOY_HEROKU.bat
```

This will deploy your system to Heroku!

---

**Pro Tip:** Keep Command Prompt window open the entire time. Don't close it until deployment is complete!
