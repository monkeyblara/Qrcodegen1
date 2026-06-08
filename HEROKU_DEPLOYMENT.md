# 🚀 Deployment Guide - Heroku + MongoDB Atlas

## Step 1: Setup MongoDB Atlas (Free Cloud Database)

1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Sign up** for a free account
3. **Create a new project**
4. **Build a cluster** - Choose the FREE tier (M0 Sandbox)
5. **Complete security setup:**
   - Create a database user (save username/password)
   - Whitelist all IPs (0.0.0.0/0)
6. **Get your connection string:**
   - Click "Connect" → "Drivers" → Copy the MongoDB URI
   - Replace `<username>` and `<password>` with your credentials
   - Example: `mongodb+srv://user:password@cluster.mongodb.net/qr-paint-system?retryWrites=true&w=majority`

## Step 2: Setup Heroku Account

1. **Go to** [Heroku](https://www.heroku.com)
2. **Sign up** for a free account
3. **Install Heroku CLI:**
   - Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
   - Or use npm: `npm install -g heroku`

## Step 3: Deploy to Heroku

### 1. Login to Heroku
```bash
heroku login
```

### 2. Initialize Git Repository
```bash
cd "c:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
git init
git add .
git commit -m "Initial commit"
```

### 3. Create Heroku App
```bash
heroku create your-app-name
```
*(Choose a unique name, e.g., `qr-paint-system-munashe`)*

### 4. Set Environment Variables
```bash
heroku config:set MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/qr-paint-system?retryWrites=true&w=majority"
heroku config:set NODE_ENV=production
```

### 5. Deploy to Heroku
```bash
git push heroku master
```

### 6. View Your App
```bash
heroku open
```

## Step 4: Initialize Default Paint Types (Run Once)

After deployment, you can add default paint types using MongoDB Atlas:
1. Go to MongoDB Atlas Collections
2. Create a new document in `painttypes` collection with default types (optional - they will auto-populate on first use)

## Important Notes

✅ **Free Tier Limitations:**
- Heroku: Free dynos sleep after 30 mins of inactivity
- MongoDB: 512MB storage (enough for ~50k products)

✅ **To Keep App Always Running:**
- Upgrade Heroku to paid tier (costs money)
- Or use a paid MongoDB plan

## Verification

After deployment:
1. Open your app URL in browser
2. Create a product
3. View QR code
4. **Share your app link** - Anyone with data connection can scan QR codes!

## Troubleshooting

**App won't start:**
```bash
heroku logs --tail
```

**Database connection failed:**
- Check `MONGODB_URI` environment variable
- Verify MongoDB Atlas whitelist includes Heroku IPs

**500 errors on API calls:**
```bash
heroku logs --tail
```

## Your App URL

Once deployed, your app will be at:
```
https://your-app-name.herokuapp.com
```

QR codes will link to:
```
https://your-app-name.herokuapp.com/product/{productId}
```

---

**Ready to deploy?** Follow the steps above! 🚀
