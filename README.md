# HabitFlow — Personal Habit Tracker & Calendar

A modern, fast, responsive personal Habit Tracker web application built with React, Vite, Tailwind CSS, and Lucide Icons. Designed for daily productivity with a clean aesthetic, interactive monthly calendar, 52-week activity heatmap, and accurate streak calculations.

---

## 🚀 Features

### 1. Dashboard
- Friendly header: *"Build Better Habits, One Day at a Time"* with today's full date.
- 4 Key Metrics: **Total Habits**, **Habits Completed Today**, **Today's Completion Rate (%)**, and **Best Active Streak**.
- Real-time daily progress bar that updates immediately when checkmarks change.
- Dynamic, encouraging motivational messages based on progress (without shaming for missed days).
- 7-Day quick consistency strip with one-click date navigation.

### 2. Interactive Monthly Calendar
- Accurate calendar grid displaying all dates, correct weekdays, month lengths, and leap years.
- Previous Month, Next Month, and **Today** quick-jump buttons.
- Real-time visual progress on each date:
  - 🟢 **Completed**: Green circle with checkmark.
  - 🟡 **Partially Completed**: Subtle indicator with completion count (e.g. `3/5`).
  - ⚪ **Untouched / Past**: Neutral indicator with scheduled count.
  - 🟦 **Future Dates**: Clearly distinguished; never marked complete automatically.
- Click any date to open and edit that specific day's habit checklist (supporting full past-date recording).
- **Yearly Activity Heatmap**: 52-week contribution matrix with hover details and date selection.

### 3. Habit Management
- Add, edit, archive, restore, and delete habits.
- Customizable properties:
  - Name & Emoji / Icon picker
  - Description
  - Color palette (Emerald, Ocean Blue, Indigo, Violet, Amber, Rose, Teal, Orange)
  - Schedule frequency: Daily, Weekdays (Mon-Fri), Weekends (Sat-Sun), or custom days
  - Optional daily reminder time
- Pre-loaded sample habits:
  - 💻 *Coding Practice* (Daily)
  - 📚 *Study* (Mon-Fri)
  - 📖 *Read 10 Pages* (Daily)
  - 🏃 *Exercise* (Mon, Wed, Fri, Sat)
  - 🎬 *Upload Video* (Tue, Thu, Sun)

### 4. Streaks & Analytics
- Accurate current streak and longest streak calculations (skipping unscheduled rest days without penalty).
- 7-Day completion rate with visual bar chart.
- Month-to-date completion statistics.
- Habit streak leaderboard ranked by consistency.

### 5. Data & Settings (100% Client-Side & Private)
- Persistent `localStorage` storage with stable IDs and `YYYY-MM-DD` date normalization.
- **Export Data**: Download a JSON backup anytime.
- **Import Data**: Upload and restore from a JSON backup with schema validation.
- **Reset All Data**: One-click restore to starter defaults with modal confirmation.
- **Dark Mode**: Toggle between light and dark themes (persisted).
- **Optional Browser Reminders**: Functional browser notification support with permission check.

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser `localStorage` (100% offline, private)

---

## 📦 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```
