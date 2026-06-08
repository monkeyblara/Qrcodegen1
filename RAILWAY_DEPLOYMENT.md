# Railway Deployment Guide

This project is a full-stack React + Express app that uses MongoDB.

## Completed repository setup

- `package.json` updated:
  - `start` runs `node server/index.js`
  - `postinstall` installs `client` deps and builds the React app
  - `engines.node` set to `>=18.0.0`
- `.env.example` updated for MongoDB deployment

## Railway deployment steps

1. Commit your changes and push them to GitHub, GitLab, or Bitbucket.

2. Open Railway and create a new project from your repository.

3. Railway will detect the Node.js project. If asked, select the root folder of this repo.

4. Add a MongoDB plugin or external MongoDB service.
   - If using Railway's MongoDB plugin, add it and copy the generated connection string.
   - If using MongoDB Atlas, use your Atlas URI.

5. In Railway project settings, add the environment variable:

   - `MONGODB_URI`

   Example:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/qr-paint-system?retryWrites=true&w=majority
   ```

6. Deploy the project.
   - Railway will install root dependencies, run `postinstall`, build `client/dist`, and start the backend.

7. After deployment, open the app URL provided by Railway.

## Important notes

- This app is not static-only; it requires a running backend and MongoDB.
- The frontend makes API calls to `/api/*`, so the Express server must handle both static files and `/api` routes.
- The backend loads `MONGODB_URI` from environment variables.

## Troubleshooting

- If the deployment fails on build, check the Railway build logs for `cd client && npm install --include=dev && npm run build`.
- If API calls fail after deployment, verify that `MONGODB_URI` is set correctly and the cluster allows connections from Railway.
- If the app serves a React page but data does not save, the backend is likely not connected to MongoDB.

## Local test before deployment

Run locally to verify the app works:

```bash
npm install
npm run build
npm start
```

Then open `http://localhost:5000`.
