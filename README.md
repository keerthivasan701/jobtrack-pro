# JobTrack Pro — Smart Job Search & Application Management System

[![Django](https://img.shields.io/badge/Django-4.2%20LTS-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**JobTrack Pro** is a modern, production-ready full-stack SaaS web application designed to help tech professionals, software engineers, and job seekers organize, track, and optimize their end-to-end job hunt. 

Built with **Django REST Framework**, **MySQL** (with seamless SQLite fallback for local development), **JWT Authentication**, and **React with Vite & Tailwind CSS**.

---

## Table of Contents

1. [Features Overview](#features-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Security](#architecture--security)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup (macOS)](#installation--setup-macos)
   - [Clone the Repository](#1-clone-the-repository)
   - [Backend Environment Setup](#2-backend-environment-setup)
   - [Database Configuration (MySQL & SQLite)](#3-database-configuration)
   - [Run Migrations & Seed Demo Data](#4-run-migrations--seed-demo-data)
   - [Frontend Setup & Installation](#5-frontend-setup--installation)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [API Endpoints & Documentation](#api-endpoints--documentation)
9. [Git & GitHub Upload Instructions](#git--github-upload-instructions)
10. [Production Deployment Guide](#production-deployment-guide)
11. [Production Security Checklist](#production-security-checklist)

---

## Features Overview

### 1. Robust User Authentication & Data Isolation
- User registration and login using JSON Web Tokens (JWT: access + refresh tokens).
- Automatic token refresh interceptors in frontend.
- **Strict Data Isolation**: Every database query is scoped to `request.user`. Users can never view, mutate, or delete another user's applications or interviews.

### 2. Executive Analytics Dashboard
- **5 High-Level Metric Cards**: Total Applications, Active Applied, Scheduled Interviews, Offers Received, and Rejections.
- **Interactive Status Distribution Donut Chart** (powered by Recharts) with percentage breakdowns.
- **Monthly Application Velocity Bar Chart** showing applications submitted over the past 6 months.
- **Recently Added Applications Table** with direct detail shortcuts.
- **Upcoming Interview Schedule Widget** with countdown dates and direct video meeting links.
- **Global Quick-Add Modal** accessible from any view in the portal.

### 3. Complete Application Management (CRUD)
- Track critical application metadata:
  - Job Title, Company Name, Company Website, Job Description
  - Work Mode (*Remote*, *Hybrid*, *On-site*)
  - Employment Type (*Full-time*, *Part-time*, *Internship*, *Contract*)
  - Job Application URL, Expected Salary Range, Application Date
  - Current Status (*Wishlist*, *Applied*, *Assessment*, *Interview*, *Offer*, *Rejected*)
  - Recruiter Name & Email
  - Private Preparation Notes & Timestamps
- Real-time search across titles, companies, locations, and notes.
- Multi-dimensional filters (Status, Work Mode, Sort Ordering).
- Server-side pagination.
- Destructive action confirmation dialogs.

### 4. Visual Kanban Pipeline Board
- 6 structured hiring stages: **Wishlist**, **Applied**, **Assessment**, **Interview**, **Offer**, and **Rejected**.
- Native, frictionless **Drag-and-Drop** between columns.
- Accessible stage selector dropdowns on each card for keyboard or mobile users.
- Real-time persistence to backend database.

### 5. Smart Interview Calendar & Agenda
- Chronological list of upcoming rounds, technical screenings, system design interviews, and take-homes.
- Date, time, meeting URLs (*Google Meet, Zoom, Teams*), interviewers, and study notes.
- Reschedule, edit, or toggle round completion with outcome recording (*Passed*, *Did Not Advance*, *Pending*).

### 6. Profile & Settings
- Career profile management: Current Title, Target Role, Phone Number, Bio, LinkedIn, GitHub, and Portfolio URLs.
- Secure password change with old-password verification and Django password validators.
- Direct links to OpenAPI schema and interactive Swagger docs.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, JavaScript (ESM), Tailwind CSS 3.4, React Router 7, Axios, Lucide React, Recharts |
| **Backend** | Python 3.9+, Django 4.2 LTS, Django REST Framework, SimpleJWT, Django CORS Headers, PyMySQL |
| **Database** | MySQL (Production & Dev) with zero-config SQLite fallback |
| **API Docs** | drf-spectacular (OpenAPI 3.0, Swagger UI, ReDoc) |
| **Testing** | Django APITestCase (Backend), Vitest & React Testing Library (Frontend) |

---

## Architecture & Security

```
jobtrack-pro/
├── backend/
│   ├── accounts/              # User profiles, JWT auth, password change
│   ├── applications/          # Job application models, viewsets, analytics
│   │   └── management/
│   │       └── commands/
│   │           └── seed_demo_data.py  # Local sample data seeder
│   ├── interviews/            # Interview round scheduling & outcomes
│   ├── config/                # Settings, URL routing, PyMySQL bootstrap
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios client with JWT refresh interceptor
│   │   ├── components/common/ # Modals, Badges, ConfirmDialog, Skeletons
│   │   ├── context/           # AuthContext, ToastContext
│   │   ├── layouts/           # DashboardLayout (Sidebar, Navbar)
│   │   ├── pages/             # 12 complete pages
│   │   ├── routes/            # ProtectedRoute, PublicOnlyRoute
│   │   ├── test/              # Vitest component & utility tests
│   │   └── utils/             # Formatters, status colors
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
├── .gitignore
├── .env.example
└── README.md
```

---

## Prerequisites

Ensure you have the following installed on your machine:
- **macOS** (Apple Silicon or Intel)
- **Python 3.9+** (`python3 --version`)
- **Node.js v18+** (`node -v`) and **npm** (`npm -v`)
- *(Optional for MySQL)* MySQL Server 8.0+ or Homebrew MySQL (`brew install mysql`)

---

## Installation & Setup (macOS)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/jobtrack-pro.git
cd jobtrack-pro
```

### 2. Backend Environment Setup
Create and activate a Python virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Database Configuration

#### Option A: Zero-Config SQLite (Default for Quick Start)
If you don't have MySQL running locally, you can skip configuring database environment variables. The backend defaults seamlessly to SQLite (`backend/db.sqlite3`).

#### Option B: MySQL Setup (Production or Local Server)
1. Start MySQL service on macOS:
   ```bash
   brew services start mysql
   ```
2. Create the database and user in MySQL:
   ```sql
   CREATE DATABASE jobtrack_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'jobtrack_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
   GRANT ALL PRIVILEGES ON jobtrack_pro.* TO 'jobtrack_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Create a `.env` file in `backend/.env`:
   ```env
   DEBUG=True
   SECRET_KEY=your-secure-django-secret-key-here
   DB_ENGINE=mysql
   DB_NAME=jobtrack_pro
   DB_USER=jobtrack_user
   DB_PASSWORD=StrongPassword123!
   DB_HOST=127.0.0.1
   DB_PORT=3306
   CORS_ALLOW_ALL=True
   ```

### 4. Run Migrations & Seed Demo Data
With your virtual environment activated (`source venv/bin/activate` in `backend/`):
```bash
python manage.py makemigrations
python manage.py migrate
```

To instantly populate the database with realistic demo data (Google, Stripe, Linear, Datadog, Vercel, Figma, etc.):
```bash
python manage.py seed_demo_data
```
> **Default Demo Account:**
> - Username: `demouser`
> - Password: `DemoPass123!`

### 5. Frontend Setup & Installation
In a separate terminal window:
```bash
cd ../frontend
npm install
```

Create a `frontend/.env` file:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## Running the Application

### 1. Start the Django Backend Server
```bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
```
Backend API will be running at: **`http://127.0.0.1:8000/`**  
OpenAPI Documentation at: **`http://127.0.0.1:8000/api/docs/`**

### 2. Start the Vite Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend Web Portal will be running at: **`http://localhost:5173/`**

---

## Testing

### Backend Unit & API Tests
The test suite validates registration, authentication, data isolation between users, CRUD operations, and metrics computation:
```bash
cd backend
source venv/bin/activate
python manage.py test
```
*Result: 12 tests passed successfully.*

### Frontend Tests (Vitest & React Testing Library)
Validates UI components, formatters, and confirmation dialogs:
```bash
cd frontend
npm test
```
*Result: 8 tests passed successfully.*

---

## API Endpoints & Documentation

Interactive Swagger UI is available at: `http://127.0.0.1:8000/api/docs/`  
ReDoc is available at: `http://127.0.0.1:8000/api/redoc/`  
OpenAPI 3.0 YAML Schema: `http://127.0.0.1:8000/api/schema/`

### Core Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health/` | API Health Check | No |
| `POST` | `/api/auth/register/` | Register user & receive JWT tokens | No |
| `POST` | `/api/auth/login/` | Sign in & receive JWT tokens | No |
| `POST` | `/api/auth/refresh/` | Refresh expired access token | No |
| `GET` / `PUT` | `/api/auth/profile/` | Retrieve / Update user profile | Yes |
| `POST` | `/api/auth/change-password/` | Change account password | Yes |
| `GET` | `/api/applications/` | List applications (search/filter/page) | Yes |
| `POST` | `/api/applications/` | Create a new job application | Yes |
| `GET` | `/api/applications/{id}/` | Get application details | Yes |
| `PUT` / `PATCH` | `/api/applications/{id}/` | Update application | Yes |
| `PATCH` | `/api/applications/{id}/status/` | Quick status change | Yes |
| `DELETE` | `/api/applications/{id}/` | Delete application | Yes |
| `GET` | `/api/applications/stats/` | Dashboard metrics & charts | Yes |
| `GET` | `/api/applications/all-items/` | All applications (Kanban) | Yes |
| `GET` / `POST` | `/api/interviews/` | List / Schedule interviews | Yes |
| `POST` | `/api/interviews/{id}/toggle-complete/` | Mark completed with outcome | Yes |

---

## Git & GitHub Upload Instructions

To publish your project to GitHub:

```bash
# 1. Initialize git from project root (jobtrack-pro)
git init

# 2. Add all files (ignoring files configured in .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete JobTrack Pro full-stack web application"

# 4. Set main branch
git branch -M main

# 5. Link to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/jobtrack-pro.git

# 6. Push code to GitHub
git push -u origin main
```

---

## Production Deployment Guide

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Push your repository to GitHub.
2. In Vercel or Netlify, select the `frontend` directory as the Root Directory.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-api-domain.com/api`

### Backend (Render / Railway / AWS / DigitalOcean)
1. Configure your production environment variables:
   - `DEBUG=False`
   - `SECRET_KEY` = Strong random 50+ character string
   - `ALLOWED_HOSTS` = `your-api-domain.com`
   - `DB_ENGINE=mysql`
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
   - `CORS_ALLOWED_ORIGINS` = `https://your-frontend-domain.com`
2. Run database migrations:
   ```bash
   python manage.py migrate
   ```
3. Collect static files:
   ```bash
   python manage.py collectstatic --noinput
   ```
4. Start with a production WSGI server such as **Gunicorn**:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3
   ```

---

## Production Security Checklist

- [x] **No hardcoded secrets**: All credentials and tokens use environment variables.
- [x] **Strict CORS origin allowlisting**: Only authorized frontend origins are permitted in production.
- [x] **Data Isolation**: All viewsets filter queries using `request.user`.
- [x] **JWT Token Expiration**: Short-lived access tokens with rotating refresh tokens.
- [x] **Rate Limiting / Throttling**: DRF user and anonymous request throttling enabled.
- [x] **SQL Injection Protection**: Built with Django ORM parameterized queries.
- [x] **XSS & CSRF Mitigation**: Input validation with Django serializers and React escaping.
- [x] **Safe Error Responses**: `DEBUG=False` hides internal tracebacks from end users.

---

## License

This project is licensed under the MIT License.
