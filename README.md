# OddsMatch

A web application for comparing horse racing odds across different platforms.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/YukiHoi/OddsMatch_Yuki_Hoi.git
   cd OddsMatch_Yuki_Hoi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your actual MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/odds_comparison?retryWrites=true&w=majority
   ```
   
   You can get your MongoDB connection string from:
   - MongoDB Atlas → Database → Connect → Connect your application

4. **Seed the database (optional)**
   
   If you have seed data, run:
   ```bash
   # Use MongoDB Compass or mongosh to import seed files from db_seeds/
   ```

5. **Start the application**
   ```bash
   npm start
   ```
   
   The app will run on `http://localhost:3000`

## Features

- User authentication with Passport.js
- Browse horse racing odds
- Compare odds across platforms
- User registration and login

## Project Structure

```
├── app.js                 # Main Express application
├── app_api/              # API routes and controllers
│   ├── controllers/      # API logic
│   ├── models/          # Database models
│   └── routes/          # API endpoints
├── app_server/          # Server-side rendering
│   ├── controllers/     # Page controllers
│   ├── models/         # Server models
│   ├── routes/         # Web routes
│   └── views/          # Pug templates
├── public/             # Static assets
└── db_seeds/          # Database seed data
```

## Security Note

⚠️ **Never commit your `.env` file to Git!** It contains sensitive credentials. The `.gitignore` file is already configured to exclude it.

## Technologies Used

- Express.js
- MongoDB + Mongoose
- Passport.js (authentication)
- Pug (templating)
- Bootstrap (CSS framework)
