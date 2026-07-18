# Walkthrough - HireHub Full-Stack Job Portal

We have successfully built, verified, and enhanced **HireHub** with premium visual layouts, rich analytics, and out-of-the-box interactive features.

## Immersive Attention-Grabbing UI Features

### 🔑 Split-Panel Futuristic Auth Gate (`Login.jsx`)
- **Luxury Split Layout**: Overhauled the login experience with a brand showcase.
- **Left Panel (Cyber-Terminal)**: Embeds a floating mock terminal console showing live environment diagnostics, JWT check processes, and database seed outputs, set against active particle grids.
- **Right Panel (Glass Login)**: Displays a glass login capsule with coordinate spotlights, accent glowing borders, and modern input fields.

### 🌌 Global Ambient Cursor Torch (`App.jsx`)
- **Interactive Light Follower**: Tracks mouse coordinates globally and places a soft, glowing radial gradient spotlight (`rgba(99, 102, 241, 0.08)`) directly beneath the pointer position. The spotlight floats behind all elements (`z-0` behind `z-10` content panels) and softly illuminates the grid pattern layout, creating a futuristic visual depth.

### 🛸 Floating Glass Capsule Navbar (`Navbar.jsx`)
- **Luxury Floating Design**: Replaced the traditional blocky full-width navbar with a floating navigation capsule. It sits centered near the top of the screen (`sticky top-0 w-full px-4 pt-4`) and renders a gorgeous glass card with a frosted-glass background (`bg-slate-950/75 backdrop-blur-xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]`).
- **Accent Logo and Links**: Features a violet-to-indigo gradient badge for the HireHub logo, uppercase bold link tabs, and a modern notifications bubble.

---

## Default Seeded Accounts

For convenience, the database is auto-seeded on backend launch with the following profiles:

| Role | Email | Password | Pre-seeded Data |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hirehub.com` | `admin123` | Control panel, registration stats, moderation deck |
| **Recruiter** | `recruiter@hirehub.com` | `recruiter123` | Pre-verified, company details, 2 posted jobs |
| **Candidate** | `candidate@hirehub.com` | `candidate123` | Developer profile details |

---

## Compilation & Build Verification

We compiled and verified both codebases locally:
1. **Spring Boot Backend**: Compiled successfully with Maven (`BUILD SUCCESS`).
2. **Vite React Frontend**: Compiled and bundled successfully into static production files (`built in 1.47s`).

---

## Instructions to Run Locally

### 1. Database Setup
Make sure MySQL is running on port 3306. The database connection is configured to auto-create the schema.
> [!NOTE]
> The database connection is configured with your password:
> `spring.datasource.password=THEGAME@1301`

### 2. Run Backend Server
From the `backend/` directory, launch the Spring Boot app on port **8081**:
```bash
cd C:\Users\bsneh\.gemini\antigravity\scratch\hirehub\backend
.\mvnw spring-boot:run
```

### 3. Run Frontend Dev Server
From the `frontend/` directory, run the React app:
```bash
cd C:\Users\bsneh\.gemini\antigravity\scratch\hirehub\frontend
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.
