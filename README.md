# Todo System with Redis Caching and Cron Jobs

## Features
- JWT-based User Authentication (Signup/Login)
- Todo CRUD (title, description, status)
- Redis caching for GET todos (expires in 3 mins)
- Cron job to log pending todos every 2 minutes

## Setup

1. Install dependencies:
npm install

markdown
Copy code

2. Start MongoDB and Redis locally.

3. Create `.env` file:
PORT=8080
MONGO_URL=mongodb://localhost:27017/tododb
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379

markdown
Copy code

4. Run the server:
node server.js

markdown
Copy code

5. Use Postman or Curl to test:
- `POST /auth/signup`
- `POST /auth/login`
- `POST /todos` with token
- `GET /todos` with token

Cron job logs pending todos every 2 minutes in the console.