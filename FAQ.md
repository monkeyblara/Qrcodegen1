# FAQ & Troubleshooting - Paint QR Code Generator System

## Frequently Asked Questions

### General Questions

#### Q: Can I use this offline?
**A:** The application can work offline locally, but you need Node.js installed and must run `npm install` first. For cloud/web versions, internet is required.

#### Q: Is this system secure?
**A:** This is a development/small-business focused system. For enterprise use, add:
- User authentication
- HTTPS/SSL
- Database encryption
- Access control
- Input validation (already implemented)

#### Q: How many products can I store?
**A:** SQLite can handle millions of records. Practically, this depends on your server specifications. For 10,000+ products, consider upgrading to PostgreSQL.

#### Q: Can multiple users access the system simultaneously?
**A:** Not in the current version (single-user). To enable multi-user:
- Implement user authentication
- Use a cloud database (Firebase, MongoDB, PostgreSQL)
- Add real-time sync (WebSocket)

#### Q: Can I back up my data?
**A:** Yes! Three methods:
```bash
# Method 1: Direct file copy
cp server/qr_paint.db server/qr_paint.db.backup

# Method 2: SQLite backup
sqlite3 server/qr_paint.db ".backup server/qr_paint.db.backup"

# Method 3: Export to CSV
sqlite3 server/qr_paint.db "SELECT * FROM products" > products.csv
```

#### Q: Can I restore from backup?
**A:** Yes:
```bash
sqlite3 server/qr_paint.db ".restore server/qr_paint.db.backup"
```

### Setup & Installation

#### Q: I get "command not found: npm"
**A:** Node.js isn't installed or not in PATH.
- Download Node.js: https://nodejs.org/
- Install LTS version
- Restart terminal/computer
- Verify: `node --version` and `npm --version`

#### Q: setup.bat shows "npm not found"
**A:** Same issue as above. Install Node.js and restart the batch file.

#### Q: "Port 5000 is already in use"
**A:** Another application uses port 5000.
```bash
# Windows - Find and kill
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux - Find and kill
lsof -i :5000
kill -9 <PID>

# Or change the port in server/index.js
# Change: const PORT = process.env.PORT || 5000;
# To: const PORT = process.env.PORT || 5001;
```

#### Q: "Port 3000 is already in use"
**A:** Same as above. Use `npm run build && serve -s client/build -l 3001`

#### Q: Dependencies won't install
**A:** Try clean install:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
cd client
npm install
cd ..
```

#### Q: "Module not found" errors
**A:** Make sure all dependencies are installed:
```bash
npm install
cd client && npm install && cd ..
```

### Running & Development

#### Q: Application won't start
**A:** Debug step by step:
```bash
# 1. Check Node.js is working
node --version

# 2. Install dependencies
npm install

# 3. Try starting server only
npm run server

# 4. In another terminal, try client
cd client && npm start

# 5. Check error messages carefully
# 6. Restart terminal and try again
```

#### Q: Frontend loads but shows blank page
**A:**
- Check browser console (F12)
- Check backend is running on port 5000
- Try hard refresh (Ctrl+Shift+R)
- Check for API errors

#### Q: QR codes not generating
**A:**
- Make sure product is created successfully
- Check console for errors (F12)
- Ensure react-qr-code is installed: `npm install react-qr-code`
- Verify product has valid ID

#### Q: "Cannot GET /" error
**A:** You're accessing port 5000 directly (backend API).
- Frontend is at: `http://localhost:3000`
- Backend API is at: `http://localhost:5000/api/products`

#### Q: Backend restarts constantly
**A:** Likely error in code. Check:
```bash
npm run server
# Watch for error messages
```

### Database & Data

#### Q: Where is my data stored?
**A:** In `server/qr_paint.db` (SQLite file in project directory)

#### Q: Can I move the database?
**A:** Yes, edit `server/database.js`:
```javascript
const DB_PATH = path.join(__dirname, 'qr_paint.db');
// Change to:
const DB_PATH = '/path/to/new/location/qr_paint.db';
```

#### Q: Database is corrupted
**A:** 
```bash
# Option 1: Reset (lose data)
rm server/qr_paint.db

# Option 2: Restore from backup (if available)
sqlite3 server/qr_paint.db ".restore server/qr_paint.db.backup"
```

#### Q: How do I export all products?
**A:**
```bash
# Export to CSV
sqlite3 server/qr_paint.db ".mode csv" ".output products.csv" "SELECT * FROM products;"

# Export to JSON (manual)
sqlite3 server/qr_paint.db ".mode json" ".output products.json" "SELECT * FROM products;"
```

#### Q: Can I import data?
**A:** Currently manual. You can:
- Add products through UI (recommended)
- Use SQL insert: `sqlite3 server/qr_paint.db "INSERT INTO products VALUES(...)"`

### QR Codes

#### Q: QR code won't scan
**A:**
- Check QR code is fully visible
- Ensure good lighting
- Try different QR scanner app
- Verify browser is running on accessible IP
- Check firewall isn't blocking access

#### Q: QR code links to wrong place
**A:** Default: `http://localhost:3000/product/{id}`
- For local network: Use your computer's IP address
- Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Update QR code if hostname changes

#### Q: Downloaded QR image is too small
**A:** QR code size is 256x256px. To enlarge:
- Print at larger scale
- Resize image file after download
- Modify size in `App.js`: change `size={256}` to larger value

#### Q: QR code quality is poor
**A:** Try downloading JPG instead of PNG, or:
- Increase size in `App.js`
- Use print function for better quality

### Printing & Downloads

#### Q: Download button doesn't work
**A:**
- Check browser download settings
- Verify files aren't being blocked
- Try different browser
- Check browser console for errors (F12)

#### Q: Print shows blank page
**A:**
- Wait for page to fully load
- Try different browser
- Check print preview (Ctrl+Shift+P)
- Ensure JavaScript is enabled

#### Q: Downloaded file has wrong name
**A:** File should be: `SN-{serial}.{format}`
- If not, check serial number is valid
- Check browser console for errors

#### Q: Print doesn't include product info
**A:** Different print options available:
- Print from product panel → prints QR only
- Print from scanned details page → prints full info
- Use browser print (Ctrl+P) from details page

### Mobile & Scanning

#### Q: Camera won't scan QR code
**A:**
- Make sure camera permission is granted
- Try built-in camera app's QR reader
- Try dedicated QR scanner app
- Check QR code is printed clearly
- Ensure good lighting

#### Q: Cannot access product details on phone
**A:** 
- Must use computer's IP address, not localhost
- Same WiFi network required
- Check firewall settings
- Example: `http://192.168.1.100:3000/product/{id}`

#### Q: Mobile page is hard to read
**A:** Interface is responsive but:
- Pinch to zoom on most phones
- Rotate phone to landscape
- Check browser zoom settings

### Performance & Issues

#### Q: Application is slow
**A:**
- Check if server process is running
- Verify database file isn't corrupted
- Check available disk space
- Restart application: `npm run dev`
- Close other heavy applications

#### Q: Browser uses too much memory
**A:**
- Close unused browser tabs
- Restart browser
- For large lists (1000+ products), consider pagination

#### Q: API calls are slow
**A:**
- Network might be slow
- Try different network
- Check server logs
- Database might need indexing (advanced)

### Advanced Issues

#### Q: Need to run on different port
**A:** Edit `server/index.js`:
```javascript
const PORT = process.env.PORT || 5000;
// Change to:
const PORT = 8000;  // or any available port
```

And for client proxy in `client/package.json`:
```json
"proxy": "http://localhost:8000"
```

#### Q: Need to integrate with existing database
**A:** Edit `server/database.js`:
```javascript
const DB_PATH = 'path/to/existing/database.db';
```

#### Q: Need to add authentication
**A:** Consider using:
- Passport.js for Node.js
- Auth0 for managed auth
- Firebase Authentication

---

## Error Messages & Solutions

| Error | Solution |
|-------|----------|
| `EADDRINUSE: address already in use :::5000` | Port in use - kill process or change port |
| `Cannot find module 'express'` | Run `npm install` |
| `SQLITE_CANTOPEN` | Check database file path permissions |
| `CORS error` | Check backend is running |
| `Module not found: Can't resolve 'react-qr-code'` | Run `npm install` in client folder |
| `Error: connect ECONNREFUSED 127.0.0.1:5000` | Backend not running - start with `npm run server` |
| `ReferenceError: window is not defined` | Server-side code trying to use browser API |

---

## Tips & Best Practices

### Performance
- Regularly backup database
- Monitor file size (check with `ls -lh server/qr_paint.db`)
- For 10,000+ products, add database indexes
- Consider pagination for large lists

### Security
- Don't share database file publicly
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement user authentication for multi-user

### Maintenance
- Keep Node.js updated
- Update npm packages: `npm update`
- Review logs regularly
- Test backups regularly

### Development
- Use VS Code for editing
- Install extensions: ES7+ React snippets
- Use developer tools (F12) for debugging
- Check console for error messages

---

## Need More Help?

### Resources
- README.md - Full documentation
- FEATURES.md - Feature details
- DEPLOYMENT.md - Production deployment
- QUICKSTART.md - Quick start guide
- Node.js docs: https://nodejs.org/docs/
- SQLite docs: https://www.sqlite.org/docs.html
- React docs: https://react.dev/

### Getting Support
1. Check this FAQ first
2. Search error message in documentation
3. Check browser console (F12) for errors
4. Review server logs
5. Try a fresh installation
6. Create detailed issue report if needed

---

Last Updated: June 2, 2026
