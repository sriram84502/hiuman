# HIUMAN - The Human Connection App

HIUMAN is a "Human Connection App" designed for Gen-Z, replacing swiping with science, psychology, and vibe.
It features a "Premium Dark/Neon" aesthetic, deep personality matching (MBTI + Big Five), and real-time interactions.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v3, Framer Motion.
- **Backend API**: PHP 8 (Native, MVC-lite), MySQL.
- **Real-time Video**: Node.js + Socket.io (Signaling Server).

## Prerequisites
- Node.js (v18+)
- PHP (v8.0+)
- MySQL Database

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `hiuman_db`.
2. Import the schema file located at `hiuman-api/schema.sql`.
   ```bash
   mysql -u root -p hiuman_db < hiuman-api/schema.sql
   ```
3. Update `hiuman-api/api/config/Database.php` with your DB credentials if different from default.

### 2. Install Dependencies
**Frontend**:
```bash
cd hiuman-web
npm install
```

**Video Signaling Server**:
```bash
cd hiuman-signal
npm install
```

### 3. Running Development Servers

You need to run 3 terminals:

**Terminal 1: Frontend (React)**
```bash
cd hiuman-web
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2: Backend API (PHP)**
```bash
cd hiuman-api
php -S localhost:8000
# Runs on http://localhost:8000
```

**Terminal 3: Video Signaling (Node.js)**
```bash
node hiuman-signal/index.js
# Runs on port 3001
```

## Features

### Core
- **DeepMatch Algorithm**: Matches based on MBTI, Big Five, and Energy Level.
- **Vibe Check**: Interactive landing page slider logging vibes to DB.
- **Identity Tags**: Soft tags like "Student", "Creative", "Founder".

### Engagement
- **Circles**: Community micro-networks based on interests.
- **Chat**: Text chat with polling and "AI Opener" suggestions.
- **Mini-Games**: "Truth or Comfort" integrated into chat.
- **Karma System**: Points for healthy interactions.

### Video
- **DeepMatch Live**: Omegle-style random video matching using WebRTC.

## Folder Structure
- `hiuman-web/`: React Frontend
- `hiuman-api/`: PHP Backend
- `hiuman-signal/`: Node.js Signaling Server

## Production Build
To build the frontend for production:
```bash
cd hiuman-web
npm run build
```
The output will be in `hiuman-web/dist`.
