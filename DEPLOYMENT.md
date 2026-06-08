# QR Code Generator System - Deployment Guide

This guide provides instructions for deploying the Paint QR Code Generator System to production environments.

## Table of Contents
1. [Local Development](#local-development)
2. [Building for Production](#building-for-production)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Configuration](#environment-configuration)

## Local Development

### Prerequisites
- Node.js v14+ 
- npm v6+
- SQLite3

### Quick Start

1. **Clone/Download the project**
   ```bash
   cd "QR CODE GENERATOR SYSTEM"
   ```

2. **Run setup script**
   
   **Windows:**
   ```bash
   setup.bat
   ```
   
   **Linux/Mac:**
   ```bash
   bash setup.sh
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The application will open at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Development Commands

```bash
# Start both client and server concurrently
npm run dev

# Start only the server
npm run server

# Start only the client
npm run client

# Build for production
npm run build

# Run tests (when added)
npm test
```

## Building for Production
8
### Create Production Build

```bash
npm run build
```

This creates an optimized React build in `client/build/` directory.

### Serve Production Build

```bash
# Install serve globally
npm install -g serve

# Navigate to project root and start
npm run server

# In another terminal, serve the client build
cd client
serve -s build -l 3000
```

## Docker Deployment

### Dockerfile for Production

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build client
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Setup server
WORKDIR /app
COPY server ./server

EXPOSE 5000

CMD ["npm", "run", "server"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
      - "3000:3000"
    volumes:
      - ./server:/app/server
      - ./client/build:/app/client/build
    environment:
      NODE_ENV: production
      PORT: 5000
```

### Run with Docker

```bash
# Build image
docker build -t qr-paint-system .

# Run container
docker run -p 5000:5000 -p 3000:3000 qr-paint-system

# Or use Docker Compose
docker-compose up
```

## Cloud Deployment

### Deploying to Vercel (Frontend Only)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel
   ```

### Deploying to Heroku (Backend + Frontend)

1. **Create Heroku account and install CLI**

2. **Create app**
   ```bash
   heroku create your-app-name
   ```

3. **Create Procfile** in project root:
   ```
   web: npm run server
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Add build script in package.json**
   ```json
   "heroku-postbuild": "cd client && npm install && npm run build"
   ```

### AWS EC2 Deployment

1. **Launch Ubuntu EC2 instance**

2. **SSH into instance and install dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm sqlite3 -y
   ```

3. **Clone project and install**
   ```bash
   git clone <repo-url>
   cd "QR CODE GENERATOR SYSTEM"
   npm install
   cd client && npm install && npm run build && cd ..
   ```

4. **Install PM2 for process management**
   ```bash
   sudo npm install -g pm2
   ```

5. **Start application**
   ```bash
   pm2 start npm --name "qr-paint-system" -- run server
   pm2 startup
   pm2 save
   ```

6. **Setup reverse proxy with Nginx**
   ```bash
   sudo apt install nginx -y
   ```

   Edit `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80 default_server;
       server_name _;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

## Environment Configuration

### Create .env file

```bash
# Server Port
PORT=5000

# Database
DATABASE_PATH=./qr_paint.db

# Client Settings
REACT_APP_API_URL=http://localhost:5000

# Security
NODE_ENV=development
```

### Production .env

```bash
PORT=5000
DATABASE_PATH=/var/lib/qr-paint/qr_paint.db
REACT_APP_API_URL=https://yourdomain.com
NODE_ENV=production
```

## Database Management

### Backup Database

```bash
# Copy database file
cp server/qr_paint.db server/qr_paint.db.backup

# Or use SQLite backup
sqlite3 server/qr_paint.db ".backup server/qr_paint.db.backup"
```

### Restore Database

```bash
sqlite3 server/qr_paint.db ".restore server/qr_paint.db.backup"
```

### Export Data to CSV

```bash
sqlite3 server/qr_paint.db <<EOF
.mode csv
.output products.csv
SELECT * FROM products;
.quit
EOF
```

## Performance Optimization

### Enable Gzip Compression

In `server/index.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### Enable CORS Caching

```javascript
app.use(cors({
  origin: process.env.REACT_APP_API_URL,
  credentials: true
}));
```

### Database Indexing

```sql
CREATE INDEX idx_serialNumber ON products(serialNumber);
CREATE INDEX idx_createdAt ON products(createdAt DESC);
```

## Security Considerations

1. **Set environment variables** for sensitive data
2. **Enable HTTPS** in production
3. **Validate input** on both client and server
4. **Sanitize database inputs** to prevent SQL injection
5. **Use rate limiting** for API endpoints
6. **Implement CORS** properly
7. **Keep dependencies updated** with `npm audit`

## Monitoring & Logging

### Using PM2 Monitoring

```bash
pm2 monit
pm2 logs qr-paint-system
```

### Enable Request Logging

In `server/index.js`:
```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Lock
```bash
# Remove database file and recreate
rm server/qr_paint.db
npm run server
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run server
```

## Support & Help

For issues and questions:
1. Check README.md
2. Review error logs
3. Check GitHub issues
4. Contact development team

---

Last Updated: June 2, 2026
