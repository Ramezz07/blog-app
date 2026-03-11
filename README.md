# TheBlog — 3-Tier Blog Application

A full-stack blog application built for DevOps deployment practice.

## Tech Stack

| Layer      | Technology              | Hosting                  |
|------------|-------------------------|--------------------------|
| Frontend   | React.js                | AWS S3 + CloudFront      |
| Backend    | Node.js + Express       | AWS EC2 (Docker)         |
| Database   | MongoDB Atlas           | MongoDB Cloud            |

## Features

- User registration & login (JWT auth)
- Create, read, update, delete blog posts
- Category filtering & search
- Like posts
- Personal dashboard with stats
- View count tracking

## Project Structure

```
blog-app/
├── frontend/          # React app
├── backend/           # Node.js API
├── docker-compose.yml # Local dev
└── README.md
```

## Local Development

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB Atlas URI
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Docker (Backend only)
```bash
docker-compose up -d
```

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
NODE_ENV=development
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Frontend `.env.production`
```
REACT_APP_API_URL=https://<your-ec2-ip>/api
```

## API Endpoints

| Method | Endpoint                  | Auth | Description           |
|--------|---------------------------|------|-----------------------|
| POST   | /api/auth/register        | No   | Register user         |
| POST   | /api/auth/login           | No   | Login user            |
| GET    | /api/auth/me              | Yes  | Get current user      |
| GET    | /api/posts                | No   | Get all posts         |
| GET    | /api/posts/:id            | No   | Get single post       |
| POST   | /api/posts                | Yes  | Create post           |
| PUT    | /api/posts/:id            | Yes  | Update post           |
| DELETE | /api/posts/:id            | Yes  | Delete post           |
| PUT    | /api/posts/:id/like       | Yes  | Like/unlike post      |
| GET    | /api/posts/stats/summary  | Yes  | Get author stats      |
| GET    | /api/health               | No   | Health check          |

## Deployment

1. Push code to GitHub
2. Configure Jenkins credentials (github-cred, aws-cred, ec2-ssh-key, MONGO_URI, JWT_SECRET)
3. Run Jenkins pipeline
4. Frontend → S3 + CloudFront
5. Backend → EC2 Docker container
