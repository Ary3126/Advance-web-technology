Practical 8 — Performance Optimization and Lazy Loading in React

This PRA-8 folder contains a small demo project and a baseline app to demonstrate route-based lazy loading using React.lazy and Suspense. It is based on the Practical description provided by the course.

How it's organized
- src/ - demo app with static imports (use this to build baseline)
- baseline-app/ - duplicate app (non-lazy) for side-by-side comparison

Quick start
1. cd "D:\advance web technology\PRA-8"
2. npm install
3. npm run dev

What to test
- Open DevTools Network tab, reload the app, and note JS bundle sizes for baseline and lazy builds.
- Enable Slow 3G throttling to observe Suspense fallback UI when using lazy-loaded routes.

Implementation
- `Home` is loaded with the initial bundle.
- `Projects` and `Contact` are loaded only when their routes are opened with `React.lazy`.
- `Suspense` displays a loading message while a route chunk is being downloaded.

To verify the output, run `npm run build`. The `dist/assets` folder should contain separate JavaScript chunks for the lazy-loaded pages. Run `npm run dev`, open the app, and use the navigation to confirm that Projects and Contact load on demand.
