# 🚀 Deployment Guide - SmarterASP.net + MongoDB Atlas

## Overview
SmarterASP.net is a Windows hosting provider that supports Node.js applications. We'll deploy your QR system there with MongoDB Atlas for the database.

## Prerequisites
- SmarterASP.net account (with Node.js support)
- MongoDB Atlas account (free)
- FTP/SFTP client (FileZilla or built-in)

---

## Step 1: Create MongoDB Atlas Database (Cloud)

### 1.1 Go to MongoDB Atlas
- Visit: https://www.mongodb.com/cloud/atlas
- Sign up for free account

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose **FREE tier (M0 Sandbox)**
3. Select your region (closest to your users)
4. Create cluster

### 1.3 Setup Security
1. Click "Security" → "Database Access"
2. Add Database User:
   - Username: `qrpaint`
   - Password: (generate strong password)
   - Save these credentials!

### 1.4 Whitelist IPs
1. Click "Security" → "Network Access"
2. Click "Add IP Address"
3. Enter: `0.0.0.0/0` (allow all - for testing)
4. Add entry

### 1.5 Get Connection String
1. Click "Databases" → "Connect"
2. Choose "Drivers"
3. Copy the connection string
4. Replace `<username>` and `<password>`
5. Add database name: `/qr-paint-system`

**Example:**
```
mongodb+srv://qrpaint:YourPassword123@cluster.mongodb.net/qr-paint-system?retryWrites=true&w=majority
```

---

## Step 2: Setup SmarterASP.net

### 2.1 Create Account
1. Visit: https://www.smarteraspnet.com
2. Sign up (choose plan with Node.js)
3. Complete payment
4. Wait for activation email

### 2.2 Access Control Panel
1. Login to: https://www.smarteraspnet.com/myaccount.aspx
2. Find your "Domain Manager"
3. Note your:
   - FTP Host
   - FTP Username
   - FTP Password
   - Application folder path

### 2.3 Create Node.js Application
1. In Control Panel, find "Node.js Settings"
2. Create new Node.js application
3. Set "Application startup file": `server/index.js`
4. Set "Node.js version": Latest available
5. Save settings

---

## Step 3: Prepare Your App for Deployment

### 3.1 Update package.json
Ensure you have:
```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server/index.js",
    "build": "cd client && npm run build"
  }
}
```

### 3.2 Build Frontend
Run locally:
```bash
npm run build
```
This creates `client/dist` folder (required for production)

### 3.3 Create Deployment Package
```bash
# Delete unnecessary files
Remove: node_modules (both root and client)
Remove: .env (SmarterASP.net will set this)
Remove: database.js (no longer needed)

# Keep everything else
```

---

## Step 4: Deploy to SmarterASP.net

### 4.1 Upload Files via FTP

**Using FileZilla (recommended):**
1. Download: https://filezilla-project.org
2. Open FileZilla
3. File → Site Manager → New Site
4. Enter:
   - Host: (from SmarterASP.net)
   - Protocol: SFTP
   - User: (from SmarterASP.net)
   - Pass: (from SmarterASP.net)
5. Connect

**Upload steps:**
1. Navigate to your application folder on SmarterASP.net
2. Upload ALL files (except node_modules and .env)
3. Make sure `server/index.js` is at root level

### 4.2 Install Dependencies on SmarterASP.net

Via SmarterASP.net Control Panel:
1. Go to Node.js Settings
2. Find "Package Manager" or "Command Line"
3. Run: `npm install`
4. Wait for completion

---

## Step 5: Configure Environment Variables

### 5.1 In SmarterASP.net Control Panel
1. Find "Environment Variables" section
2. Add new variable:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://qrpaint:password@cluster.mongodb.net/qr-paint-system?retryWrites=true&w=majority`
3. Add: `NODE_ENV` = `production`
4. Save

### 5.2 Restart Node.js Application
- In Control Panel, find "Stop Application"
- Click Stop
- Wait 10 seconds
- Click Start

---

## Step 6: Test Your Deployment

1. Get your app URL from SmarterASP.net
   - Usually: `http://yourdomain.com` or `http://yoursubdomain.smarteraspnet.com`

2. Open in browser and test:
   - ✅ Homepage loads
   - ✅ Create a product
   - ✅ View QR code
   - ✅ Download QR code

3. Share the URL - users can scan QR codes from anywhere!

---

## Troubleshooting

### App Won't Start
```
Check SmarterASP.net logs:
Control Panel → Logs → Application Error Log
```

### MongoDB Connection Error
- Verify `MONGODB_URI` is set correctly
- Check IP whitelist in MongoDB Atlas (0.0.0.0/0)
- Verify database user credentials

### Port Already in Use
- SmarterASP.net assigns ports automatically
- Use: `process.env.PORT || 5000`
- This is already in your code ✓

### Files Not Updating
- SmarterASP.net caches files
- Stop application → Wait 10 sec → Start application
- Clear browser cache (Ctrl+Shift+Delete)

---

## Your App URL After Deployment

**Frontend:**
```
http://yourdomain.smarteraspnet.com
```

**QR Code Links:**
```
http://yourdomain.smarteraspnet.com/product/{productId}
```

---

## Important Notes

⚠️ **SmarterASP.net Specifics:**
- Uses Windows servers (not Linux)
- Supports Node.js but check version availability
- FTP access only (no SSH)
- Regular backups recommended

✅ **Cost:**
- MongoDB Atlas: FREE
- SmarterASP.net: ~$3-5/month

---

## Next Steps

1. ✅ Create MongoDB Atlas account (Step 1)
2. ✅ Create SmarterASP.net account (Step 2)
3. ✅ Build frontend locally: `npm run build`
4. ✅ Upload via FTP (Step 4)
5. ✅ Set environment variables (Step 5)
6. ✅ Test your app (Step 6)

**Ready?** Let me know which step you're on! 🚀
