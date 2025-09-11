# Keeper

A modern note-keeping web application built with React, Express, and PostgreSQL.

## Prerequisites

1. **Install Node.js (with npm)**
   - Download and install Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)
   - npm is included with Node.js.

2. **Install PostgreSQL**
   - Download and install PostgreSQL from: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
   - During installation, set a password for the default `postgres` user and remember it.
   - Make sure PostgreSQL is running and you can connect using pgAdmin or the command line.

3. **Create Database and Tables**
   - Open `psql` or pgAdmin and run:
     ```sql
     CREATE DATABASE keeper;
     \c keeper
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       first_name VARCHAR(100) NOT NULL,
       middle_name VARCHAR(100),
       last_name VARCHAR(100) NOT NULL
     );
     CREATE TABLE notes (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       title VARCHAR(255) NOT NULL,
       content TEXT NOT NULL,
       created_at TIMESTAMP NOT NULL
     );
     ```
   - Adjust table fields as needed for your use case.

## Installing the Project

1. **Clone the repository**
   ```sh
   git clone <your-repo-link>
   cd keeper
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Create a `.env` file**
   - Place this file in the project root (where `index.html` is located).
   - Example format:
     ```env
     PORT=3000
     USER=postgres
     HOST=localhost
     DATABASE=keeper
     PASSWORD=PasswordToDatabase
     DBPORT=5432
     SECRET=SecretExample
     ReactPort=5173
     ```
   - Replace values with your actual database credentials and desired ports.

4. **Configure Vite Proxy**
   - Your `vite.config.js` should look like:
     ```js
     import { defineConfig } from 'vite'
     import react from '@vitejs/plugin-react-swc'

     export default defineConfig({
       plugins: [react()],
       server: {
         proxy: {
           '/api': {
             target: 'http://localhost:3000',
             changeOrigin: true
           }
         }
       }
     })
     ```
   - This allows your React frontend to communicate with the Express backend during development. The '3000' is the port number the server will be running on. If the port number for server is different, change it accordingly. 

5. **Start the Backend Server**
   ```sh
   node 'server file name'
   ```
   - Or use your preferred method to start the Express server.

6. **Start the React Frontend**
   ```sh
   npm run dev
   ```
   - By default, Vite runs on port 5173. Make sure this matches your `.env` ReactPort value.

## Additional Configuration

- Make sure your PostgreSQL server is running before starting the backend.
- If you change database credentials, update both `.env` and your database setup.
- For production, set secure values for `SECRET` and use environment variables for sensitive data.
- You may need to allow CORS for your frontend port in the Express server.
- If you encounter issues, check your terminal for error messages and verify all services are running.

## Features
- User authentication (register, login, session management)
- Create, view, and delete notes
- Change password and update user info
- Modern UI with responsive design

## Troubleshooting
- If you see database connection errors, verify your `.env` values and PostgreSQL status.
- For frontend/backend communication issues, check the Vite proxy and port settings.
- For any other errors, review logs and error messages for guidance.

## License
MIT

---

For questions or help, feel free to open an issue or contact the project owner.
