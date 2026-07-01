# Wobb Frontend Assignment

A starter influencer search application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project is intentionally left in a rough-but-working state for candidates to improve.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## What's Included

- **Search / Dashboard** — filter influencers by platform (Instagram, YouTube, TikTok) and search by username or full name
- **Profile Details** — click a profile to view extended data loaded from individual JSON files
- **Routing** — `react-router-dom` with `/` (search) and `/profile/:username` (details)

Sample data lives in:

- `src/assets/data/search/` — platform search results (10 profiles each)
- `src/assets/data/profiles/` — detailed profile JSON per username

## How to Submit

1. **Download or clone** this starter project to your machine.
2. **Create a new repository** on your own GitHub account. Do not fork the original assignment repo — push your work to a repo you own.
3. Complete the tasks below and push your changes to that repository.
4. **Share the public GitHub repository URL** with us as your submission.

### Deadline (strict)

- **Due:** **2 July 2026, 2:00 PM IST** (Indian Standard Time, UTC+5:30)
- **Any git commits made after this deadline will disqualify your submission.** We will only consider the repository state as of the deadline; late commits will not be reviewed.
- Make sure your final work is pushed **before** the cutoff.

## AI Usage

You may use any AI tools (Cursor, ChatGPT, Claude, GitHub Copilot, etc.). We are evaluating your final solution and engineering decisions.

## Your Tasks

Complete the following as part of your submission:

1. **Find and fix all bugs and quality issues** — the codebase contains intentional bugs and quality issues. Identify and resolve them.

2. **Completely redesign the UI/UX** — replace the basic layout with a polished, modern interface. Focus on usability, visual hierarchy, and delight.

3. **Replace React Context with Zustand** — when you implement state management for the selected list, use [Zustand](https://github.com/pmndrs/zustand) instead of React Context.

4. **Implement "Select profile & Add to List"** — the disabled "Add to List" button is a stub. Build the full feature:
   - Select / add profiles to a persistent list
   - View and manage the selected list
   - Handle duplicates appropriately

5. **Improve code quality and project structure** — refactor as needed, add proper types, and follow React best practices.

6. **Optimize performance** — apply sensible optimizations where appropriate.

7. **Use any libraries you need** — you are not limited to the current stack. Choose tools that help you deliver a great result (UI kits, state managers, testing libraries, etc.).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run lint` | Run ESLint               |

## Submission Notes & Refactoring Summary

I have completed all the tasks of this assignment, delivering a production-ready, clean, and highly optimized version of the Influencer Search platform.

### 1. Key Features & Implementations

- **Persistent Zustand Store**: Replaced React state/context stubs with a robust Zustand state manager using `persist` middleware. State persistence is optimized using the `partialize` filter, ensuring that only the `selectedProfiles` array is serialized to `localStorage` (transient searches and cache maps are excluded to keep storage limits small).
- **"Select Profile & Add to List" Drawer**: Developed a right-aligned sliding panel (`src/components/SelectedListDrawer.tsx`) using `framer-motion` to view selections. It displays influencer details, calculates the combined reach/follower metric dynamically, provides single trash/remove triggers, and includes a "Clear All" action. It supports exporting selections as CSV spreadsheets, plain text reports, system sharing sheets, or sharing directly to WhatsApp and Twitter/X.
- **Responsive Card Grid Layout**: Changed the list format from a single column of static `w-[700px]` rows into a responsive, flexible grid that fits on mobile, tablet, and desktop viewports seamlessly.
- **Premium Black & White Redesign**: Rewrote stylesheets and markup to construct a high-contrast black-and-white theme (`#000000` and `#ffffff`) with sharp corners (flat straight edges), green (`#22c55e`) selection badge details, and center-aligned page title and creator details layouts.

### 2. Bugs & Quality Fixes

- **Case-insensitive Search**: Corrected a bug in `src/utils/dataHelpers.ts` where `matchUsername` was case-sensitive (e.g. searching "mr" didn't find "mrbeast" if casing changed). It now uses `toLowerCase()` matching.
- **Detail Stats Cards Bug**: Fixed two errors in the influencer statistics section of `src/pages/ProfileDetailPage.tsx`:
  1. The **Engagement Rate** card previously multiplied the database float by `10000` (which outputted `142.50%` instead of `1.43%`). It now uses the `formatEngagementRate` utility which correctly scales by `100`.
  2. The **Engagements** card was printing the *engagement rate* float formatted as a percentage instead of formatting the actual *engagements count* (e.g., `1.32M` engagements). It now correctly renders the `user.engagements` value.
- **React Icons Integration**: Used brand-specific vectors (`FaInstagram`, `FaYoutube`, `FaTiktok`) instead of standard strings to make the platform indicators feel rich and high-end.

### 3. Performance Optimizations

- **Fine-grained Subscriptions**: Selected state slices individually (`useAppStore(state => state.field)`) to prevent unnecessary component re-renders when unrelated store properties change.
- **Mount & Animate Optimization**: Scaled transitions with `AnimatePresence` and staggered framer-motion entry delays using capped sequence timings (`idx * 0.04`).

### 4. Assumptions & Trade-offs

- **Selected Profile Payload**: Rather than storing only `user_id` inside `localStorage` (which would require re-loading profile JSON detail sheets on startup), the store tracks summary structures (`user_id`, `username`, `fullname`, `picture`, `followers`, `platform`, `is_verified`). This keeps page loads instant and local storage small (~1KB max).
- **Mock Actions**: Action triggers (such as clicking the drawer's "Export List" button) alert users dynamically with campaign reach summaries.

Good luck!

