# Complete Installation & Setup Guide

## React Portfolio Application - Step-by-Step Setup

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Creation](#project-creation)
3. [Dependency Installation](#dependency-installation)
4. [Project Structure](#project-structure)
5. [Running the Application](#running-the-application)
6. [Building for Production](#building-for-production)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 16.0.0 or higher | JavaScript runtime |
| **npm** | 7.0.0 or higher | Package manager |
| **Operating System** | Windows/Mac/Linux | Development environment |
| **RAM** | 4GB minimum | For development |
| **Disk Space** | 500MB minimum | Project files |

### Check Installation

```bash
# Check Node.js version
node --version
# Expected: v16.0.0 or higher

# Check npm version
npm --version
# Expected: 7.0.0 or higher
```

### Download & Install

If not installed, download from:
- **Node.js**: https://nodejs.org/ (LTS version recommended)
- Includes npm automatically

---

## Project Creation & Structure

### Option 1: Starting Fresh with Vite

```bash
# Create a new Vite React project
npm create vite@latest student-portfolio -- --template react

# Navigate to project
cd student-portfolio

# Install dependencies
npm install
```

### Option 2: Using Existing Project

If you already have the project directory:

```bash
cd student-portfolio
npm install
```

### Verify Project Structure

```bash
student-portfolio/
├── node_modules/          # All installed packages
├── public/                # Static files
├── src/                   # Source code
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
├── package.json           # Project metadata
├── vite.config.js         # Vite configuration
├── index.html             # HTML entry point
└── .gitignore             # Git ignore file
```

---

## Dependency Installation

### Step 1: Install Core Dependencies

```bash
# Navigate to project directory
cd student-portfolio

# Install all dependencies from package.json
npm install

# Or use yarn if preferred
yarn install

# Or use pnpm
pnpm install
```

### Step 2: Install React Router DOM

```bash
# If not already in package.json
npm install react-router-dom

# Verify installation
npm list react-router-dom
```

### What Gets Installed?

```
student-portfolio
├── react (UI framework)
├── react-dom (React in browser)
├── react-router-dom (Routing)
├── vite (Build tool)
├── @vitejs/plugin-react (Vite React plugin)
└── ESLint packages (Code quality)
```

### Verify Dependencies

```bash
# Check package.json
cat package.json

# Should show:
{
  "dependencies": {
    "react": "^18.0.0 or higher",
    "react-dom": "^18.0.0 or higher",
    "react-router-dom": "^6.0.0 or higher"
  }
}
```

---

## Project Structure Setup

### Create Component Files

```bash
# Navigate to src directory
cd src

# Create components folder
mkdir components
mkdir pages

# Create component files
touch components/Navbar.jsx
touch components/Footer.jsx
touch pages/Home.jsx
touch pages/Projects.jsx
touch pages/Contact.jsx
touch pages/NotFound.jsx

# Create CSS files
touch components/Navbar.css
touch components/Footer.css
touch pages/Home.css
touch pages/Projects.css
touch pages/Contact.css
touch pages/NotFound.css
```

### Directory Tree

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Navbar.css
│   ├── Footer.jsx
│   └── Footer.css
│
├── pages/
│   ├── Home.jsx
│   ├── Home.css
│   ├── Projects.jsx
│   ├── Projects.css
│   ├── Contact.jsx
│   ├── Contact.css
│   ├── NotFound.jsx
│   └── NotFound.css
│
├── App.jsx
├── App.css
├── main.jsx
├── index.css
└── assets/
```

---

## Running the Application

### Start Development Server

```bash
# From project root directory
npm run dev

# Output should show:
# VITE v8.1.4  ready in 1234 ms
# ➜  Local:   http://localhost:5173/
```

### Access the Application

1. **Browser URL**: Open http://localhost:5173/
2. **Local Network**: http://192.168.x.x:5173/ (for testing on other devices)

### Hot Module Replacement (HMR)

- Make changes to files
- Save (Ctrl+S)
- Browser automatically refreshes
- No full page reload needed
- State may be preserved depending on changes

### Stop Development Server

Press `Ctrl+C` in terminal to stop the server

---

## Building for Production

### Create Production Build

```bash
# Build optimized production version
npm run build

# Output files in 'dist/' directory
# Ready for deployment
```

### Build Output

```
dist/
├── index.html           # Main HTML file
├── assets/
│   ├── index-XXXXX.js   # Bundled JavaScript (minified)
│   └── index-XXXXX.css  # Bundled CSS (minified)
└── vite.svg            # Assets

Size typically: 150-200KB total (gzipped)
```

### Preview Production Build Locally

```bash
# Preview the production build
npm run preview

# Output:
# ➜  Local:   http://localhost:4173/
```

### Deploy Production Build

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and your site is live!
```

#### Option 2: Netlify

1. Go to netlify.com
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy automatically on push

#### Option 3: GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/student-portfolio"

# Create build
npm run build

# Deploy with gh-pages package
npm install --save-dev gh-pages
npx gh-pages -d dist
```

#### Option 4: Traditional Server

1. Run `npm run build`
2. Upload `dist` folder contents to web server
3. Configure server for SPA (single page app)
4. Ensure all routes point to index.html

---

## NPM Scripts Explained

### Available Commands

```bash
# Development
npm run dev              # Start dev server (HMR enabled)
npm run dev -- --port 3000  # Custom port

# Production
npm run build           # Create production build
npm run preview         # Preview production build locally

# Code Quality
npm run lint            # Check for ESLint errors
npm run lint -- --fix   # Auto-fix ESLint issues

# Other
npm install             # Install dependencies
npm update              # Update dependencies
npm list                # List installed packages
npm uninstall <package> # Remove a package
```

---

## Environment Variables (Optional)

### Create .env File

```bash
# Create .env file in project root
touch .env

# Add variables
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Student Portfolio
```

### Use Environment Variables

```javascript
// In components
const apiUrl = import.meta.env.VITE_API_URL
console.log(apiUrl)  // http://localhost:3000
```

### Environment-Specific Files

```
.env                 # Default
.env.development     # For npm run dev
.env.production      # For npm run build
```

---

## Troubleshooting

### Issue: "npm: command not found"

**Solution**: Install Node.js from https://nodejs.org/

```bash
# Verify installation
node --version
npm --version
```

### Issue: Port 5173 Already in Use

**Solution 1**: Use different port
```bash
npm run dev -- --port 3000
```

**Solution 2**: Kill process using port
```bash
# On Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# On Mac/Linux
lsof -ti:5173 | xargs kill
```

### Issue: Module Not Found Errors

**Solution**: Reinstall dependencies
```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -r node_modules
# Windows: rmdir /s node_modules

# Reinstall
npm install
```

### Issue: React Router Not Working

**Check**:
1. Ensure BrowserRouter wraps Routes in App.jsx
2. Verify React Router DOM is installed
3. Check import statements are correct

```javascript
// Correct setup
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

<Router>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Router>
```

### Issue: CSS Not Applying

**Check**:
1. CSS file is imported in component
2. File name matches exactly (case-sensitive on Mac/Linux)
3. Check browser DevTools for CSS errors
4. Clear browser cache (Ctrl+Shift+Delete)

```javascript
// Correct import
import './Navbar.css'  // Must match filename exactly
```

### Issue: Dark Mode Not Working

**Check**:
1. isDarkMode state is defined in App.jsx
2. Class name is correctly applied
3. CSS selectors are correct

```javascript
// Correct
<div className={isDarkMode ? 'app dark-mode' : 'app'}>

// CSS
.app { /* light mode */ }
.app.dark-mode { /* dark mode */ }
```

### Issue: Form Not Submitting

**Check**:
1. e.preventDefault() is called
2. Form validation passes
3. State is properly managed
4. onChange handlers are attached

```javascript
// Correct form setup
const handleSubmit = (e) => {
  e.preventDefault()  // Prevent page reload
  // Handle submission
}

<form onSubmit={handleSubmit}>
  <input onChange={handleInputChange} />
</form>
```

### Issue: 404 Page Always Shows

**Check**:
1. Routes are defined before wildcard route
2. Route paths are correct
3. Links use correct paths

```javascript
// Correct order
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/projects" element={<Projects />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="*" element={<NotFound />} />  // Last
</Routes>
```

### Issue: Slow Build Time

**Solutions**:
1. Close other applications
2. Update dependencies: `npm update`
3. Clear node_modules and reinstall
4. Check disk space (need 500MB+)
5. Check RAM usage

### Issue: Changes Not Reflecting

**Solutions**:
1. Ensure dev server is running: `npm run dev`
2. Check file is saved (editor shows save indicator)
3. Refresh browser (F5)
4. Clear browser cache
5. Restart dev server

---

## Performance Optimization

### Reduce Bundle Size

```bash
# Analyze bundle
npm install --save-dev vite-plugin-visualizer

# View report
npm run visualize
```

### Code Splitting

```javascript
// Lazy load components
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))

<Suspense fallback={<div>Loading...</div>}>
  <Home />
</Suspense>
```

### Optimize Assets

```bash
# Compress images
npm install --save-dev imagemin

# Use WebP format for images
# Serve optimized assets
```

---

## Version Management

### Check Installed Versions

```bash
npm list
npm list react
npm list react-router-dom
```

### Update Packages

```bash
# Update to latest patch version
npm update

# Update to latest major version
npm install react@latest

# Install specific version
npm install react@18.2.0
```

### Lock Versions

```
package-lock.json (auto-generated)
- Locks all dependency versions
- Ensures consistent installations
- Created automatically by npm
```

---

## Git Setup (Optional)

### Initialize Git Repository

```bash
# Initialize git
git init

# Add files
git add .

# Create initial commit
git commit -m "Initial commit: React Router Portfolio App"

# Add remote repository
git remote add origin https://github.com/yourusername/student-portfolio.git

# Push to GitHub
git push -u origin main
```

### .gitignore

```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

---

## Quick Reference

### Essential Commands

| Task | Command |
|------|---------|
| **Start dev server** | `npm run dev` |
| **Build for production** | `npm run build` |
| **Preview build** | `npm run preview` |
| **Install dependencies** | `npm install` |
| **Lint code** | `npm run lint` |
| **Update packages** | `npm update` |
| **Stop server** | `Ctrl+C` |

### URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:5173/` | Development server |
| `http://localhost:4173/` | Production preview |
| `/` | Home page |
| `/projects` | Projects page |
| `/contact` | Contact page |
| `/any-invalid-url` | 404 page |

---

## Support Resources

### Documentation

- [React Official Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Vite Docs](https://vitejs.dev)
- [npm Docs](https://docs.npmjs.com)

### Common Issues

- Stack Overflow: Tag with `react`, `vite`, `react-router`
- GitHub Issues: Check existing issues
- React Discord: https://discord.gg/react

### Tools

- **VS Code**: Best editor for React development
- **React DevTools**: Browser extension for debugging
- **Redux DevTools**: For advanced state management

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Run development server
3. ✅ Explore the application
4. ✅ Modify components
5. ✅ Add your content
6. ✅ Customize styling
7. ✅ Build for production
8. ✅ Deploy to hosting service

---

**Happy Coding! 🚀**

For questions or issues, refer to the [THEORY_ANSWERS.md](./THEORY_ANSWERS.md) and [COMPLETE_README.md](./COMPLETE_README.md) files.
