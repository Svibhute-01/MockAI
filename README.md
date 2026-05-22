# MockAI — AI-Powered Mock Interview Platform

MockAI is a full-stack web application that helps job seekers practice interviews with an AI interviewer. Upload your resume, get tailored questions, answer via text or voice, and receive a detailed performance report — all powered by GPT-4o-mini.

---

## Features

- **Google Sign-In** — Secure authentication via Firebase
- **Resume Parsing** — Upload a PDF resume; AI extracts your skills and projects
- **AI Question Generation** — 10 personalized interview questions based on your role, experience, and resume
- **Live Interview** — Answer questions by typing or speaking (voice input via browser mic)
- **Real-Time Evaluation** — Each answer is scored across Overall, Correctness, Communication, and Confidence
- **Performance Report** — Final score ring, animated bar charts, strengths & weaknesses, AI hiring recommendation
- **Downloadable Report** — Print the full report as a PDF
- **Credit System** — Users start with 100 credits; each interview session costs 50

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | Firebase (Google OAuth) + JWT (HttpOnly cookies) |
| AI | OpenRouter API — GPT-4o-mini |
| PDF Parsing | pdfjs-dist (in-memory via Multer) |
| State Management | Redux Toolkit |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |

---

## Project Structure

```
mockai/
├── client/                    # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── api.js         # Axios instance (baseURL "/")
│       ├── components/
│       │   ├── Navbar.jsx     # Top nav with credits & user menu
│       │   ├── Step1SetUp.jsx # Resume upload + interview config
│       │   ├── Step2Interview.jsx  # Live interview UI
│       │   ├── Step3Report.jsx     # Final performance report
│       │   ├── AuthModel.jsx  # Google sign-in modal
│       │   └── Footer.jsx
│       ├── pages/
│       │   ├── Home.jsx       # Landing page
│       │   └── Interview.jsx  # Orchestrates 3-step interview flow
│       ├── redux/
│       │   ├── store.js
│       │   └── userSlice.js   # User state (name, credits)
│       └── utils/
│           └── firebase.js    # Firebase config
│
├── server/                    # Express backend
│   └── src/
│       ├── index.js           # Entry point (DB connect, server start)
│       ├── app.js             # Express app (CORS, routes, cookies)
│       ├── models/
│       │   ├── user.model.js
│       │   └── interview.model.js
│       ├── controllers/
│       │   ├── googleAuth.controller.js
│       │   ├── user.controller.js
│       │   └── interview.controller.js
│       ├── routes/
│       │   ├── auth.route.js
│       │   ├── user.route.js
│       │   └── interview.route.js
│       ├── middlewares/
│       │   ├── isAuth.js      # JWT verification middleware
│       │   └── multer.js      # Memory-based file upload
│       └── services/
│           └── openRouter.js  # GPT-4o-mini API wrapper
│
└── README.md
```

---

## Environment Variables

### Server (`server/.env`)

```env
PORT=3001
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Client (`client/.env`)

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)
- Firebase project with Google Sign-In enabled
- OpenRouter API key

### 1. Clone the Repository

```bash
git clone https://github.com/Svibhute-01/MockAI.git
cd MockAI
```

### 2. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure Environment Variables

Create `server/.env` and `client/.env` using the variables listed above.

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project and enable **Google Sign-In** under Authentication
3. Add your domain to **Authorized Domains** (Settings → Authentication → Authorized domains)

### 5. Run the Application

```bash
# Terminal 1 — Backend (port 3001)
cd server && npm start

# Terminal 2 — Frontend (port 5000)
cd client && npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/google` | No | Sign in with Google, returns JWT cookie |
| POST | `/api/auth/logout` | No | Clear session cookie |
| GET | `/api/user/current-user` | Yes | Get logged-in user data |
| POST | `/api/interview/analyze-resume` | Yes | Parse PDF + extract skills/projects |
| POST | `/api/interview/start` | Yes | Create session + generate 10 questions |
| POST | `/api/interview/submit-answer` | Yes | Save answer + AI evaluation |
| POST | `/api/interview/end` | Yes | Finalize interview + generate report |
| GET | `/api/interview/:id` | Yes | Fetch a session by ID |

---

## Interview Flow

```
1. User uploads resume PDF + fills in role, experience, mode
        ↓
2. Backend parses PDF in memory → GPT extracts skills & projects
        ↓
3. GPT generates 10 tailored questions → saved to MongoDB
        ↓
4. User answers each question (text or voice) within time limit
        ↓
5. GPT evaluates each answer → scores: Overall, Correctness,
   Communication, Confidence
        ↓
6. After all questions → GPT produces final report:
   strengths, weaknesses, hiring recommendation
        ↓
7. User views & downloads the full performance report
```

---

## AI Usage (4 calls per session)

| Step | Prompt Purpose |
|---|---|
| Resume Analysis | Extract role, skills, and projects from raw PDF text |
| Question Generation | Create 10 tailored questions based on role + resume |
| Answer Evaluation | Score and provide feedback on each answer |
| Report Generation | Produce overall strengths, weaknesses, recommendation |

All AI responses are returned as structured JSON using `response_format: json_object`.

---

## Credits System

- New users receive **100 credits** on sign-up
- Each interview session costs **50 credits**
- Credits can be topped up via the Upgrade Plan button in the Navbar

---

## License

MIT License — feel free to use, modify, and distribute.
