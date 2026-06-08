# Quick MongoDB Setup - Command Reference

## ✅ Prerequisites
- Node.js and npm installed
- MongoDB Atlas account with active cluster
- Connection string in `.env`

## 🚀 Quick Start (Copy & Paste These Commands)

### 1. Install Dependencies
```bash
cd "c:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
npm install
```

### 2. Seed Initial Data to MongoDB
```bash
npm run seed
```

### 3. (Optional) Migrate Data from SQLite
```bash
npm run migrate
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. (In New Terminal) Test All APIs
```bash
npm run test:api
```

---

## 📊 What Each Command Does

| Command | Purpose | Output |
|---------|---------|--------|
| `npm install` | Installs all dependencies | List of installed packages |
| `npm run seed` | Creates sample data in MongoDB | Database summary with counts |
| `npm run migrate` | Imports data from SQLite to MongoDB | Migration report with counts |
| `npm run dev` | Starts server with hot reload | Server running message |
| `npm run test:api` | Tests all API endpoints | Test results (14 tests) |
| `npm run build` | Builds React frontend | Build artifacts |
| `npm run server` | Starts server only (no frontend) | Server running message |

---

## 🧪 Manual API Testing (Alternative to npm run test:api)

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Paint Types
```bash
curl http://localhost:5000/api/paint-types
```

### Create New Paint Type
```bash
curl -X POST http://localhost:5000/api/paint-types \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Matte\"}"
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Create New Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d "{
    \"productName\": \"Test Paint\",
    \"brand\": \"Dulux\",
    \"paintType\": \"Acrylic\",
    \"quantity\": \"5L\",
    \"expiryDate\": \"2025-12-31\"
  }"
```

---

## 📁 New Files Created

| File | Purpose |
|------|---------|
| `server/seed-data.js` | Initializes MongoDB with sample data |
| `server/migrate-to-mongodb.js` | Migrates SQLite data to MongoDB |
| `server/test-api.js` | Comprehensive API test suite |
| `.env` | Updated with MongoDB Atlas connection |
| `package.json` | Added 3 new npm scripts |

---

## ✅ Expected Results

### After `npm run seed`:
```
✅ Seeded 6 paint types
✅ Seeded 4 sample products
✅ Seeded 4 sample saved paints
```

### After `npm run dev`:
```
✅ MongoDB connected successfully
Server running on http://localhost:5000
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

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB Atlas:** https://cloud.mongodb.com

---

## 📞 Need Help?

Check the detailed guide: `MONGODB_SETUP_COMPLETE.md` in your session folder
