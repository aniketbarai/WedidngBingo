# Wedding Bingo Backend

This is the backend part of the Wedding Bingo application, built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/weddingDB
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   PORT=5000
   ```

3. Run the server:
   ```
   npm start
   ```

The backend will run on `http://localhost:5000`.

## API Endpoints

- `POST /send-mail`: Send contact inquiry emails
- `GET /images`: Get gallery images
- `POST /click/:id`: Track image clicks
- `POST /like/:id`: Like an image
- `GET /seed`: Seed dummy data (for development)