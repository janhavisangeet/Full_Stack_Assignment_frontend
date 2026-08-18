# Pyramid Frontend - Task & Project Management System

Pyramid is a premium, production-ready frontend interface for the Task & Project Management System, built strictly according to the Figma design specs.

## 🛠 Tech Stack

* **Framework**: Next.js 16 (App Router with Turbopack)
* **Libraries**: React 19, TypeScript
* **Styling**: TailwindCSS (v4) & Vanilla CSS Modules for full custom styling control

---

## 🚀 Core Features

1. **Guest Authentication**: Interactive guest sign-in flow that generates and holds secure sessions.
2. **Interactive Task Dashboard**:
   - **Kanban Board View**: Column-based view (To Do, Doing, Completed, On Hold) with inline task cards showing assignees, due dates, and tags.
   - **List Accordion View**: Collapsible accordion table grouped by status.
3. **Column Visibility Toggles ("Fields" Dropdown)**: Segments view toggle (List vs. Board) and checkboxes to dynamically show or hide fields (Priority, Members, Due Date, Labels, Status, Reporter) in real-time.
4. **Task CRUD Forms**: Modal-driven creation, deletion, and quick inline status changes via contextual options.
5. **Theme Customization & Persistence**:
   - **Light / Dark Mode**: Toggles theme classes globally.
   - **Accent Color Themes**: Support for 6 different client-selected accent colors.
   - Fully persistent via local storage caching.
6. **Detailed Settings / Profile Editor**: Fully editable fields for email, name, title, and username with instant database persistence and avatar render.

---

## ⚙️ Local Development Setup

### 1. Prerequisites
Ensure you have Node.js (v18+ or v20+) installed on your machine.

### 2. Installation
Navigate to the frontend folder and install all dependencies:
```bash
cd frontend
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Running the Development Server
Start the frontend development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
To create a production-optimized build:
```bash
npm run build
npm start
```
