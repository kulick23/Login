# User Management Application

This application is split into two parts:

- **server** – The backend built with Node.js, Express, and MySQL.
- **client** – The frontend built with React.

## Database Setup

1. **Restore the Database Dump:**

   Open your terminal and run the following command (adjust credentials if necessary):

   ```bash
   mysql -u root -p user_management < dump.sql
   ```

2. **MySQL Credentials:**

   In the file `./server/config/db.js`, ensure you have set your MySQL login and password:

   ```javascript
   user: process.env.DB_USER || 'root',
   password: process.env.DB_PASSWORD || 'password',
   ```

## Installation

1. **Server Dependencies:**

   Open a terminal, navigate to the server directory, and install dependencies:

   ```bash
   cd server
   npm install
   ```

2. **Client Dependencies:**

   Open a terminal, navigate to the client directory, and install dependencies:

   ```bash
   cd client
   npm install
   ```

## Running the Application

1. **Start the Server:**

   In the server directory, start the backend service:

   ```bash
   cd server
   npm start
   ```

2. **Start the Client:**

   In the client directory, start the frontend:

   ```bash
   cd client
   npm run dev
   ```

The server will run on the port specified in your `.env` file (default is 5000), and the client will usually run on [http://localhost:3000](http://localhost:3000) or as configured by your setup.