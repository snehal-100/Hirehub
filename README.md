# 🚀 HireHub - Intelligent Hiring Operating System

<div align="center">

![HireHub Banner](frontend/src/assets/hero.png)

**A Next-Generation Full-Stack Talent Platform & Job Board**  
Built with **Spring Boot 3.4**, **Java 17**, **React 19**, **Vite**, **Tailwind CSS**, and **MySQL 8**.

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Live Demo](#-live-deployment) • [Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-local-development-setup) • [API Docs](#-api-endpoints) • [Demo Credentials](#-pre-seeded-demo-accounts)

</div>

---

## 🌟 Overview

**HireHub** is an enterprise-grade, high-performance job board and applicant tracking system (ATS). Designed with modern SaaS aesthetics (inspired by Linear and Vercel), it unites job seekers, corporate recruiters, and platform administrators through intelligent matching, telemetry dashboards, and real-time interaction flows.

---

## ✨ Key Features

### 🎨 Next-Gen UI & Visual Effects
- **Floating Glass Capsule Navbar**: Frosted-glass floating capsule navigation with real-time notification badging.
- **Linear/Vercel Cursor Spotlight Cards**: Dynamic mouse-coordinate calculation rendering glowing radial outline highlights on hover.
- **Interactive Neural Particle Canvas**: HTML5 Canvas hero backdrop featuring physics-based floating nodes connecting and tracking user cursor movements.
- **Global Ambient Torch**: Subtle ambient light follower softly illuminating the tech grid backdrop.
- **Split-Panel Cyberpunk Auth Gates**: High-tech telemetry console paired with an ultra-glass sign-in deck.

---

### 🤖 AI-Powered Capabilities
- **AI Skill Compatibility Matcher**: Parses job descriptions against candidate skills and renders an animated circular SVG matching dial with identified skill matches and gap recommendations.
- **AI Magic Cover Letter Generator**: Typewriter-style code generation simulation that produces personalized, role-specific cover letters linking candidate skills directly to requirements.
- **Smart Resume Parser Wizard**: Step-by-step simulated resume layout parser extracting headlines, bios, skill sets, and work history directly into profile fields.
- **AI Career Counselor Chatbot**: Interactive floating conversational assistant helping candidates discover roles based on their tech stack.

---

### 👥 Role-Based Modules

#### 🎯 Candidate Module
- **Profile Management**: Upload PDF resumes (with full add/delete/view support), headshot photos, and social handles (GitHub, LinkedIn, Portfolio).
- **Application Tracking**: Real-time status pipeline tracking (`APPLIED` ➔ `REVIEWED` ➔ `SHORTLISTED` ➔ `INTERVIEW` ➔ `SELECTED` / `REJECTED`).
- **Interactive Analytics**: Recharts Funnel breakdown wheel and application milestone timeline.
- **Watchlist**: Bookmark dream positions for fast 1-click access.

#### 🏢 Recruiter Module
- **Vacancy Lifecycle**: Post, edit, close, and manage job listings with categories, experience levels, and salary ranges.
- **Applicant Review Deck**: View applicant profiles, inspect attached resumes, evaluate cover letters, and update candidate hiring stages.
- **Printable Executive Summary**: One-click printable recruiter report format with statistics and table breakdowns.
- **Talent Conversion Telemetry**: Real-time charts measuring hiring ratios and applicant stages.

#### 🛡️ Admin Platform & Moderation
- **Platform Telemetry Deck**: System-wide statistics measuring registered candidates, recruiters, active openings, and total submissions.
- **Recruiter Verification Queue**: Moderation deck ensuring only legitimate corporate organizations can publish listings.
- **User Authorization Deck**: Block, unblock, or permanently remove bad actors across the network.
- **Registration Trends**: Visualized monthly sign-up telemetry using gradient-filled Recharts.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client["React 19 + Vite Frontend SPA (Tailwind CSS)"]
    
    subgraph Security & Filter
        JwtFilter["JWT Authentication Filter"]
        SecurityConfig["Spring Security 6 (Stateless)"]
    end
    
    subgraph REST Controllers
        AuthCtrl["AuthController (/api/auth)"]
        JobCtrl["JobController (/api/jobs)"]
        CandCtrl["CandidateController (/api/candidate)"]
        RecCtrl["RecruiterController (/api/recruiter)"]
        AppCtrl["ApplicationController (/api/applications)"]
        SavedCtrl["SavedJobController (/api/saved-jobs)"]
        AdminCtrl["AdminController (/api/admin)"]
        NotifCtrl["NotificationController (/api/notifications)"]
    end

    subgraph Service Layer
        AuthService["Auth & Token Service"]
        JobService["Job Management Service"]
        CandService["Candidate & Resume Service"]
        RecService["Recruiter Service"]
        AppService["Application Workflow Service"]
        AdminService["Platform Moderation Service"]
    end

    subgraph Storage
        MySQL[("MySQL 8 Database")]
        DiskStorage[("File System (Resumes & Logos)")]
    end

    Client -->|Bearer JWT Token| JwtFilter
    JwtFilter --> SecurityConfig
    SecurityConfig --> REST Controllers
    REST Controllers --> Service Layer
    Service Layer --> MySQL
    Service Layer --> DiskStorage
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Backend Framework** | **Spring Boot 3.4.1** | Modern Java enterprise backend framework |
| **Language** | **Java 17 (OpenJDK / Temurin)** | LTS Java runtime |
| **Security** | **Spring Security 6 + JWT** | Stateless token-based auth (`jjwt 0.11.5`) |
| **ORM & Data** | **Spring Data JPA / Hibernate** | Database abstraction and automatic DDL generation |
| **Database** | **MySQL 8.0 / Aiven Cloud** | Relational data persistence with connection pooling (HikariCP) |
| **Frontend Framework** | **React 19 + Vite 6** | Lightning-fast Hot Module Replacement SPA |
| **Styling** | **Tailwind CSS 4.0** | Modern utility-first styling with custom shaders & animations |
| **Data Visualization** | **Recharts** | Smooth SVG-based responsive analytics and charts |
| **Icons** | **Lucide React** | Clean, consistent icons |
| **Containerization** | **Docker** | Multi-stage production container build |
| **Hosting** | **Render (Backend) + Vercel (Frontend)** | Scalable cloud deployment |

---

## 🔑 Pre-Seeded Demo Accounts

When the backend runs, it automatically seeds the database with the following demo profiles:

| Role | Email | Password | Pre-loaded Content |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@hirehub.com` | `admin123` | Full access to moderation deck, telemetry, user controls |
| 🏢 **Recruiter** | `recruiter@hirehub.com` | `recruiter123` | Pre-verified employer profile with active job listings |
| 👨‍💻 **Candidate** | `candidate@hirehub.com` | `candidate123` | Completed profile with skills (Java, React, SQL), sample resume |

---

## 🚀 Local Development Setup

### Prerequisites
- **Java 17+** ([Download OpenJDK](https://adoptium.net/))
- **Node.js 18+** & **npm** ([Download Node](https://nodejs.org/))
- **MySQL 8.0+** running locally on port `3306`
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/hirehub.git
cd hirehub
```

---

### 2. Configure & Run Backend

1. **Configure Database Connection**:
   Open `backend/src/main/resources/application.properties` and verify your local MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hirehub?createDatabaseIfNotExist=true&useSSL=false
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

2. **Run Spring Boot**:
   ```bash
   cd backend
   # Windows
   .\mvnw spring-boot:run

   # macOS / Linux
   ./mvnw spring-boot:run
   ```
   *The backend will boot up on **`http://localhost:8081`** and automatically initialize tables and seed data.*

---

### 3. Configure & Run Frontend

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   *The frontend will launch on **`http://localhost:5173`** with hot reloading enabled.*

---

## 🌐 Live Deployment

HireHub is architected for zero-cost, high-availability cloud hosting:

### 1. Database on Aiven (Free MySQL)
1. Create a free MySQL database on [Aiven.io](https://aiven.io).
2. Copy the connection parameters (`Host`, `Port`, `Username`, `Password`, `Database name`).

### 2. Backend on Render (Web Service)
1. Connect your repository on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set **Runtime** to `Docker` (Render automatically uses the multi-stage `Dockerfile`).
4. Set Environment Variables:
   - `SPRING_DATASOURCE_URL` = `jdbc:mysql://<aiven-host>:<port>/defaultdb?useSSL=true&requireSSL=true`
   - `SPRING_DATASOURCE_USERNAME` = `<aiven-user>`
   - `SPRING_DATASOURCE_PASSWORD` = `<aiven-password>`

### 3. Frontend on Vercel
1. Import the repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set Framework Preset to `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`
5. Click **Deploy**.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new Candidate or Recruiter | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch active user credentials & role | Authenticated |

### 💼 Jobs (`/api/jobs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Paginated, filterable job listings | Public |
| `GET` | `/api/jobs/{id}` | Detailed job information | Public |
| `POST` | `/api/jobs` | Post new job opening | Recruiter |
| `PUT` | `/api/jobs/{id}` | Edit job posting | Recruiter |
| `PATCH`| `/api/jobs/{id}/close`| Close job listing | Recruiter |
| `GET` | `/api/jobs/recruiter`| Fetch recruiter's posted openings | Recruiter |

### 📝 Applications (`/api/applications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/apply/{jobId}` | Submit job application | Candidate |
| `GET` | `/api/applications/candidate` | View candidate's applications | Candidate |
| `DELETE`| `/api/applications/{id}` | Withdraw active application | Candidate |
| `GET` | `/api/applications/job/{jobId}` | View candidates for a job listing | Recruiter |
| `PATCH`| `/api/applications/{id}/status` | Update applicant hiring stage | Recruiter |

### 👤 Profile & Files
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/candidate/profile` | Get candidate profile | Candidate |
| `PUT` | `/api/candidate/profile` | Update profile fields | Candidate |
| `POST` | `/api/candidate/profile/resume` | Upload PDF resume | Candidate |
| `DELETE`| `/api/candidate/profile/resume`| Remove attached resume | Candidate |
| `POST` | `/api/candidate/profile/photo` | Upload profile photo | Candidate |
| `GET` | `/api/recruiter/profile` | Get company profile | Recruiter |
| `PUT` | `/api/recruiter/profile` | Update company profile | Recruiter |
| `POST` | `/api/recruiter/profile/logo` | Upload company logo | Recruiter |

### 🛡️ Admin Moderation (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Overall system metrics & analytics | Admin |
| `GET` | `/api/admin/users` | List all registered users | Admin |
| `PUT` | `/api/admin/users/{id}/toggle-status` | Enable/Disable user account | Admin |
| `DELETE`| `/api/admin/users/{id}` | Permanently delete user | Admin |
| `GET` | `/api/admin/recruiters` | List recruiter verification queue | Admin |
| `PUT` | `/api/admin/recruiters/{id}/verify` | Approve recruiter credentials | Admin |
| `GET` | `/api/admin/jobs` | Moderate all platform job listings | Admin |
| `DELETE`| `/api/admin/jobs/{id}` | Remove job listing | Admin |

---

## 📂 Repository Directory Structure

```text
hirehub/
├── .gitignore
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/hirehub/backend/
│       │   │   ├── controller/      # REST API Controllers
│       │   │   ├── dto/             # Data Transfer Objects
│       │   │   ├── entity/          # JPA Hibernate Entities
│       │   │   ├── exception/       # Global Error Handlers
│       │   │   ├── mapper/          # DTO <-> Entity Mappers
│       │   │   ├── repository/      # Spring Data JPA Repositories
│       │   │   ├── security/        # JWT Authentication & Filters
│       │   │   └── service/         # Business Logic Layer
│       │   └── resources/
│       │       └── application.properties
│       └── test/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── assets/                  # Logos & SVGs
        ├── components/              # Floating Navbar, RouteGuards
        ├── context/                 # AuthContext & State
        ├── pages/                   # Home, Jobs, JobDetails, Auth
        │   ├── admin/               # Admin Moderation Dashboard
        │   ├── candidate/           # Candidate Dashboard & Profile
        │   └── recruiter/           # Recruiter ATS & Post Job
        ├── services/                # Axios API with JWT Interceptors
        └── index.css                # Tailwind CSS & Shaders
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Crafted with ❤️ by **Snehal Baranwal**

*If you found this project helpful, please give it a ⭐️ on [GitHub](https://github.com/snehal-100/hirehub)!*

</div>
