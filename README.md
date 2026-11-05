# LIFELINK – SMART EMERGENCY ASSISTANCE AND COMMUNITY SUPPORT PLATFORM

> **Tagline:** *Connecting People, Help and Resources When Every Second Matters.*

![LifeLink Banner](https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80)

---

## 📌 Project Overview

**LIFELINK** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered to bridge the critical coordination gap during localized emergencies, severe weather incidents, medical crises, and community distress.

Developed as a college MERN Stack Web Development Training Program project by a team of **exactly three members**, LifeLink replaces fragmented communication with a centralized, role-based platform connecting vulnerable citizens, certified first-responder volunteers, community relief centers, and hospital blood banks in real time.

---

## 👥 Team Details (College Training Project)

| Member | Role in Project | Name | Registration Number |
| :--- | :--- | :--- | :--- |
| **Member 1** | Lead Full-Stack Architect & DevOps | *[Member 1 Name]* | *[Reg No 1]* |
| **Member 2** | Backend & Database Engineer | *[Member 2 Name]* | *[Reg No 2]* |
| **Member 3** | Frontend & UI/UX Specialist | *[Member 3 Name]* | *[Reg No 3]* |

---

## 🎯 Project Objectives

1. **Zero-Latency Incident Logging:** Allow citizens to register verified emergency tickets with photographic evidence and map coordinates in under 60 seconds.
2. **Role-Based Workflows:** Distinct portals and permission controls for **Citizens**, **Volunteers**, and **Administrators**.
3. **Smart Volunteer Recommendation:** Proprietary recommendation engine scoring volunteers based on skill alignment, geospatial proximity, and duty availability.
4. **Community Aid Stockpile:** Facilitate sharing of food, clothing, essential kits, and medical supplies.
5. **Urgent Blood Donation Coordination:** Connect matched voluntary blood donors with hospitals while strictly protecting personal contact information.
6. **Geospatial & Analytical Awareness:** Interactive OpenStreetMap integration with privacy shielding and Recharts analytics for administrative dispatch.

---

## 💻 Technologies & Architecture

### Frontend
- **React.js (Vite):** Ultra-fast modern frontend build tool.
- **Tailwind CSS (v4):** Custom SaaS aesthetics with deep navy blue (`#0b132b`), teal accents (`#06d6a0`), and emergency orange alerts (`#f97316`).
- **React Router DOM:** Dynamic client-side routing with role-guarded routes.
- **Leaflet & React-Leaflet:** Interactive OpenStreetMap integration with custom SVG markers.
- **Recharts:** Monthly emergency trend area charts and incident category distribution charts.
- **Lucide React:** Clean vector iconography.
- **Axios:** REST API client with automatic JWT bearer token interceptors.

### Backend
- **Node.js & Express.js:** Modular, scalable REST API server.
- **JWT (JSON Web Tokens):** Cryptographic session authorization.
- **bcrypt.js:** Salted password hashing (10 salt rounds).
- **Multer:** Secure multi-part photograph upload handling.
- **Morgan & CORS:** Logging and cross-origin security middleware.

### Database
- **MongoDB Atlas & Mongoose ODM:** Schema validation, strict relationships, references, and geospatial indexing.
- **Dual Connection Resilience:** Connects to MongoDB Atlas URI or local MongoDB, with automatic embedded in-memory database fallback for zero-config offline university lab evaluations!

---

## 🔑 Pre-Configured Demo Login Credentials

The application auto-seeds sample demo data on first boot. You can log in using the credentials below, or click the **1-Click Demo Logins** directly on the Login page:

| Role | Email | Password | Pre-configured Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lifelink.org` | `password123` | Full administrative console, analytics, user roster, volunteer assignment |
| **Citizen** | `citizen@lifelink.org` | `password123` | Create emergency tickets, track live timeline, request aid supplies |
| **Volunteer** | `volunteer@lifelink.org` | `password123` | Certified first responder, accept tickets, update progress notes |

---

## 🚀 Key Modules & Functionalities

### 1. Citizen Portal
- **Incident Creation:** Select category, specify urgency priority, add description, pin coordinates on OpenStreetMap, and upload photographs.
- **Privacy Shield:** Citizen's precise private address is shielded from public view; only approximate sector pins are shown.
- **Live Ticket Tracker:** Track ticket status transitions (`Pending` ➔ `Verified` ➔ `Volunteer Assigned` ➔ `In Progress` ➔ `Completed`).
- **Responder Notes:** View real-time progress updates posted by the responding volunteer.

### 2. Volunteer Responder Portal
- **Responder Profile:** Configure certified skills (First Aid, CPR, Paramedic, 4x4 Driving, Heavy Lifting) and active service sectors.
- **Availability Toggle:** Switch between `Available to Respond` and `Busy on Task` with one click.
- **Dispatch Board:** Browse nearby verified help requests matching your skills and self-accept assignments.
- **Milestone Reporting:** Post progress notes (e.g., "Picked up insulin, arriving in 10 mins") and mark tasks completed.

### 3. Administrator Command Center
- **System Analytics:** Key performance counters, monthly resolution trends (AreaChart), and category breakdowns (PieChart).
- **Request Triage:** Review incoming emergency requests, verify legitimacy, reject spam, and assign responders.
- **Algorithmic Volunteer Matching:** Scores volunteers based on:
  - Skill overlap (40%)
  - Distance proximity (25%)
  - Live availability status (30%)
  - Service category alignment (15%)
- **User & Volunteer Management:** Verify volunteer credentials, manage platform accounts, and delete inactive users.

### 4. Interactive OpenStreetMap
- Custom pins for **Help Requests** (color-coded by priority), **Community Support Centers** (shelters, relief camps, food banks), and **Resource Stockpiles**.
- Layer toggles to filter visible pins by category and metropolitan sector.
- Click-to-pin coordinate picker for accurate incident reporting.

### 5. Resource Sharing Stockpile
- List available surplus donations: Food, Clothing, Educational Materials, Essential Supplies.
- View real-time quantities, units, and pickup sectors.
- Request items with quantity and justification.

### 6. Urgent Blood Donation Coordination
- Voluntary donor registration with blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
- Verified hospital blood requests with urgency levels (`Immediate`, `Urgent`, `Normal`).
- Automated notification alerts to matching registered donors in the sector.
- **Clinical Disclaimer:** LifeLink facilitates voluntary coordination only and does not replace certified hospital blood banks.

### 7. In-App Notifications
- Real-time alerts for ticket creation, admin verification, volunteer acceptance, progress milestone updates, and completion.

---

## 🗄️ Database Design (MongoDB Collections)

```
+-------------------------------------------------------------+
|                      MongoDB Collections                    |
+-------------------------------------------------------------+
  1. Users                 -> Authentication, roles, blood donor info
  2. VolunteerProfiles     -> Skills, areas, availability, rating
  3. HelpRequests          -> Emergency tickets, coordinates, priority
  4. Assignments           -> Volunteer-to-request assignments & timeline
  5. Donations             -> Resource donations, quantities, categories
  6. ResourceRequests      -> Claims on donated resources
  7. BloodDonationRequests -> Hospital blood requirements & urgencies
  8. SupportCenters        -> Shelters, camps, capacities, contacts
  9. Notifications         -> In-app alerts with deep-link routing
```

---

## 📡 REST API Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new citizen or volunteer |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in profile & volunteer stats |
| `PUT` | `/api/auth/profile` | Private | Update profile & blood donor status |
| `GET` | `/api/requests` | Public/Private | Get help requests with status/category filters |
| `POST` | `/api/requests` | Private | Create help request with photo upload |
| `GET` | `/api/requests/my` | Private | Get requests created by logged-in citizen |
| `PUT` | `/api/requests/:id/status` | Private | Update request status (Admin/Responder) |
| `POST` | `/api/requests/:id/progress` | Private | Post progress note to ticket timeline |
| `GET` | `/api/volunteers/profile` | Volunteer | Get responder profile |
| `PUT` | `/api/volunteers/profile` | Volunteer | Update skills, service areas & availability |
| `GET` | `/api/volunteers/recommendations/:id` | Admin | Compute matching volunteers for a request |
| `GET` | `/api/volunteers/available-requests` | Volunteer | Browse open requests ready for pickup |
| `POST` | `/api/assignments` | Admin/Volunteer | Assign responder or self-accept request |
| `POST` | `/api/assignments/:id/complete` | Private | Mark task and ticket completed |
| `GET` | `/api/donations` | Public | List available resource donations |
| `POST` | `/api/donations` | Private | Add new donation to community stockpile |
| `POST` | `/api/donations/:id/request` | Private | Request items from donation |
| `GET` | `/api/blood-donations` | Public | List verified hospital blood requests |
| `POST` | `/api/blood-donations` | Private | Submit emergency blood requirement |
| `GET` | `/api/support-centers` | Public | Retrieve active relief camps & shelters |
| `GET` | `/api/notifications` | Private | Get user notifications & unread count |
| `GET` | `/api/admin/stats` | Admin | Retrieve analytics counters & chart datasets |
| `GET` | `/api/admin/users` | Admin | Retrieve user roster with filtering |
| `PUT` | `/api/admin/users/:id/verify` | Admin | Toggle user/volunteer verification status |

---

## 🛠️ Installation & Local Execution

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)
- Optional: MongoDB Community Server or MongoDB Atlas account *(Automatic in-memory DB fallback included if no MongoDB is installed locally!)*

### Step 1: Clone Repository
```bash
git clone https://github.com/<your-username>/lifelink.git
cd lifelink
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```
*(Optional: edit `.env` if you have a MongoDB Atlas connection string):*
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lifelink
JWT_SECRET=lifelink_super_secret_jwt_key_2026_secure
```

Start the backend server:
```bash
npm start
```
*The backend will automatically start on `http://localhost:5000` and seed sample records on first startup.*

### Step 3: Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Public Deployment Guide

### A. Database Deployment (MongoDB Atlas)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
3. Under **Database Access**, create a database user and copy the connection string:
   `mongodb+srv://<username>:<password>@cluster.mongodb.net/lifelink?retryWrites=true&w=majority`

### B. Backend Deployment (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository and set the **Root Directory** to `backend`.
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node src/server.js`
5. In **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A strong random secret string>`
6. Deploy and copy your backend URL (e.g., `https://lifelink-api.onrender.com`).

### C. Frontend Deployment (Vercel)
1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Set the **Framework Preset** to `Vite`.
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://lifelink-api.onrender.com/api`
5. Click **Deploy**. Both frontend and backend are now live with public access!

---

## 📊 Presentation Slides (10 Slides)

The full slide deck outline is available in `PRESENTATION_SLIDES.md` in this repository, covering:
1. Title & Team Details
2. Problem Statement & Solution
3. Project Objectives
4. MERN Stack Technologies Used
5. System Architecture & Workflow Diagram
6. Key Features by Role (Citizen, Volunteer, Admin)
7. Database Design & API Integration
8. System Screenshots & Live Demonstration
9. Challenges Faced & Future Roadmap
10. Conclusion & Learning Outcomes

---

## ⚖️ License & Academic Integrity

This project is submitted in fulfillment of the MERN Stack Web Development Training Program. Developed with academic integrity by the student team.
