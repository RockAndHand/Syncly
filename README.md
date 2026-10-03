# Real-Time Chat Application

A real-time one-to-one chat application built with **React.js, Node.js, Express.js, Socket.IO, Prisma, and PostgreSQL**.

The application provides real-time messaging between users, authentication, online-user tracking, typing indicators, conversations, and message status indicators.

## Tech Stack

### Frontend
- React.js
- JavaScript
- CSS
- Socket.IO Client
- React Icons

### Backend
- Node.js
- Express.js
- Socket.IO
- Prisma ORM
- PostgreSQL
- bcrypt
- JSON Web Token (JWT)

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- One-to-one conversations
- Real-time messaging using Socket.IO
- Online user status
- Typing indicators
- Real-time message delivery
- Duplicate message prevention
- Message status indicators
  - Sent
  - Seen
- Conversation list
- Friend/user management
- Persistent message storage using PostgreSQL
- Prisma ORM for database access

## Application Architecture

The application is divided into two main parts:

```text
React.js Client
      │
      │ HTTP / REST
      ▼
Express.js Server
      │
      ├── Authentication
      ├── User Management
      ├── Conversation Management
      └── Prisma
              │
              ▼
         PostgreSQL

React.js Client
      │
      │ Socket.IO
      ▼
Socket.IO Server
      │
      ├── Real-time Messages
      ├── Typing Indicators
      ├── Online Users
      └── Message Status
```

## Requirements

Before running the application, make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Git

You will also need a PostgreSQL database and valid database credentials.

## Environment Variables

Create a `.env` file in the server directory.

Example:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/your_database"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

Replace the database credentials and secret values with your own configuration.

Do not commit `.env` files to GitHub.

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd real-time-chat
```

### Backend

Navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run the Prisma migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

### Frontend

Open another terminal and navigate to the client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend and backend can then communicate through HTTP APIs and Socket.IO.

## Real-Time Communication

Socket.IO is used for functionality that requires immediate communication between connected users.

Current real-time functionality includes:

- New message notifications
- Message delivery
- User online status
- Typing indicators
- Message seen status

The basic message flow is:

```text
User A
  │
  │ Send message
  ▼
Socket.IO Server
  │
  │ newMessage
  ▼
User B
```

## Database

PostgreSQL is used as the persistent database.

Prisma acts as the ORM and provides:

- Database schema management
- Type-safe database queries
- Migrations
- Database client generation

The application stores persistent information such as users, conversations, and messages in PostgreSQL.

## Authentication

Authentication is handled using:

- bcrypt for password hashing
- JWT for authenticated sessions

Passwords are never stored as plain text.

## Development

The application is currently under active development.

Planned/improvable areas include:

- More reliable real-time read receipts
- Improved message delivery states
- Better connection/reconnection handling
- Improved chat experience
- Additional messaging features
- UI/UX improvements

## License

This project is currently intended for learning and development purposes.