# Merlin - InstaTracker

A web application that tracks Instagram profiles and notifies users of changes in following lists.

## Features

- User authentication with JWT
- Track up to 3 Instagram profiles per user
- Automated following list monitoring
- Email notifications for new following
- Real-time dashboard of tracked profiles

## Tech Stack

- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **External APIs**: Instagram API (via RapidAPI)
- **Email**: Nodemailer with Gmail SMTP
- **Background Jobs**: node-cron

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account with App Password
- RapidAPI Key (Instagram Best Experience API)

## Environment Variables

### Backend (.env)
```
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
RAPID_API_KEY=your_rapidapi_key
EMAIL_USER=your_gmail
EMAIL_APP_PASSWORD=your_gmail_app_password
CLIENT_URL=http://localhost:5002
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5001
```

## Installation & Setup

1. Clone the repository
```bash
git clone <repository-url>
cd MerlinProject
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Create .env files in both server and client directories with the required environment variables

5. Start the application
```bash
# Terminal 1 - Start backend
cd server
npm start

# Terminal 2 - Start frontend
cd client
npm start
```

## Deployment

The application is configured for deployment on Render.com using the `render.yaml` configuration file.

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Profile Tracking
- GET `/api/tracker/profiles` - Get tracked profiles
- POST `/api/tracker/profiles` - Add new profile to track
- DELETE `/api/tracker/profiles/:id` - Remove tracked profile

## License

MIT 