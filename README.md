# Examensarbete — Three-Part Application

React + Webpack (frontend) · ASP.NET Core MVC (backend 1) · Node.js (backend 2)

## Project Structure

```
Examensarbete/
├── frontend/          React source + Webpack config
├── aspnet-backend/    ASP.NET Core MVC, Razor views, ReactHelper
└── node-backend/      Express REST API
```

## Running the application

### 1. Build the React bundles

```bash
cd frontend
npm install
npm run build
```

This outputs hashed bundles and `manifest.json` into `aspnet-backend/wwwroot/dist/`.

For development (no hash, with source maps, watch mode):
```bash
npm run watch
```

### 2. Start the Node.js API (port 3001)

```bash
cd node-backend
npm install
npm start
```

Or with auto-restart on file change (requires Node 18+):
```bash
npm run dev
```

### 3. Start the ASP.NET Core app (port 5000)

```bash
cd aspnet-backend
dotnet run
```

Then open http://localhost:5000 in your browser.

## How it works

1. **Browser** requests a page from ASP.NET Core MVC.
2. **ASP.NET Core** renders a Razor HTML page that references React bundles.
   - `ReactHelper.cs` reads `wwwroot/dist/manifest.json` to resolve content-hashed filenames.
   - `_Layout.cshtml` loads shared chunks (`runtime`, `vendors`, `common`) + the `base` bundle (nav menu).
   - Each page view adds its own bundle via `@section Scripts`.
3. **React** mounts:
   - `base.js` → `<div id="nav">` (navigation menu, same on every page)
   - `home|users|settings.js` → `<div id="content">` (page-specific content)
4. React components `fetch` data from the **Node.js API** at `http://localhost:3001`.

## Pages

| URL | Bundle | Data source |
|-----|--------|-------------|
| `/` | `home.js` | `GET /api/health` |
| `/users` | `users.js` | `GET /api/users` |
| `/settings` | `settings.js` | `GET /api/settings` |
