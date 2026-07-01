# Wobb Frontend Assignment

A starter influencer search application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project is intentionally left in a rough-but-working state for candidates to improve.


## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🚀 Live Deployment

The application is deployed live on Vercel: **[vibecheck (Live Web Application)](https://wobb-asgnmnt-six.vercel.app/)**

---

## 🛠️ Refactoring & Architectural Summary

This version of **vibecheck** is optimized for speed, maintainability, and clean state sharing. Here is a breakdown of what was built:

### 1. What Changed
- **Persistent Zustand Store**: Replaced React Context stubs with Zustand. Selections are persisted in `localStorage` using `persist` and custom `partialize` keys (so transient searches/cache details don't overload storage).
- **Selection Drawer & Sharing Modes**: Designed a right-hand sliding menu using Framer Motion to aggregate campaign sizes, clear lists, download CSV sheets, print plaintext reports, copy handles, and natively redirect links directly to **WhatsApp** and **Twitter/X**.
- **Flat B&W Styling**: Rewrote global styling variables to create a high-contrast black-and-white layout. Enforced zero-rounding (`border-radius: 0px !important`) to strip away typical curved layouts for a sharp, border-driven aesthetic. Centered all headers, dashboard elements, and detail summaries.
- **Pulsing Skeletons & Splash Intro**: Added flat, pulsing skeleton placeholders (`ProfileCardSkeleton`) that simulate network loads when shifting tabs, and created a 3-second loader splash screen on initial boot.
- **Bug Fixes**:
  - Resolved case-sensitivity on search inputs.
  - Fixed calculations on the Detail view showing the correct engagement rate percentage (multiplied by 100 instead of 10000) and correct engagement counts (instead of duplicating engagement rates).

### 2. Libraries Added
To support automated test evaluation:
- `vitest` (Lightweight Vite-native test runner)
- `jsdom` (Mock browser environment)
- `@testing-library/react` & `@testing-library/dom` (For rendering and querying React components)

### 3. AI Tooling & Attributions
This revamp was accelerated using specialized AI assistants:
- **Antigravity IDE**: Conducted the UI restructuring, constructed the grid templates, set up the Zustand slice layers, and integrated the persistent selections drawer.
- **OpenCode (Gemini API)** & **ChatGPT**: Utilized for prompt engineering, logic refinement, and debugging Vite bundler config paths.
- **Google Veo**: Generated the custom `loader.gif` animation displayed on the initial splash screen.
- **Devin Desktop** & **GitHub Copilot**: Leveraged to locate the detail statistics bugs and verify initial syntax errors.

---

## 💡 Assumptions, Trade-offs, & Next Steps

### Assumptions
- **Zustand Payload Size**: Instead of keeping only `user_id` inside `localStorage` (which would require fetching profile details from scratch on every page load), we store complete profile summary snapshots (`user_id`, `username`, `fullname`, `picture`, `followers`, `platform`, `is_verified`). This keeps initial loads instant and fits comfortably in a ~1.5KB localStorage payload.
- **Single-Color Accent**: Assumed a clean, bright green (`#22c55e`) was ideal as the single highlight color to pop cleanly against the absolute black backgrounds.

### Trade-offs
- **Plaintext vs PDF Generators**: For the PDF export option, we generate a beautifully structured plaintext file report (`.txt`) which is universally compatible and natively printable to PDF from any system browser or editor. This avoids adding heavy client-side canvas or PDF libraries (like `jspdf`), keeping our bundle footprint small.
- **Single-Worker Tests**: Configured Vitest to run sequentially (`--no-file-parallelism --maxWorkers=1`) inside `package.json`. This slightly extends test execution time but guarantees absolute stability on standard/remote servers by avoiding child process memory exhaustion.

### Remaining Improvements
- **Advanced Query Filters**: Implement numerical range sliders to filter influencers by follower counts, engagement rate benchmarks, or specific locations.
- **CSV Import / Campaign Merge**: Allow loading previously exported campaign CSVs back into the app state to update lists on the fly.
- **Real-Time API Syncing**: Swap the static JSON loader modules with live social network integrations.

Good luck!


