# Real-Time Chat Application — Requirements

## 1. Project Objective

The objective of this project is to develop a real-time messaging application that allows registered users to communicate with each other through persistent one-to-one conversations.

The system should provide real-time communication while maintaining users, conversations, and messages in a persistent PostgreSQL database.

## 2. Functional Requirements

### 2.1 User Authentication

The system should allow users to:

- Register an account.
- Log in using email and password.
- Authenticate using JWT.
- Log out of the application.
- Store passwords securely using hashing.

### 2.2 User Management

The system should allow users to:

- View available users.
- Manage friend/user relationships.
- Send friend requests.
- Accept friend requests.
- Reject friend requests.
- View their existing connections.

### 2.3 Conversations

The system should allow users to:

- Start a conversation with another user.
- View their existing conversations.
- Select a conversation from the conversation list.
- Load previous messages from a conversation.
- Maintain conversation history after refreshing the application.

### 2.4 Messaging

Users should be able to:

- Send text messages.
- Receive messages in real time.
- View messages in chronological order.
- Prevent duplicate messages from appearing.
- Persist messages in the database.

### 2.5 Real-Time Features

The application should provide real-time updates using Socket.IO.

These include:

- New message notifications.
- Online/offline user status.
- Typing indicators.
- Message read/seen status.

### 2.6 Message Status

Messages should support delivery/read states.

The intended behavior is:

```text
Message sent
     ↓
Sent ✓
     ↓
Recipient receives/reads message
     ↓
Seen ✓✓
```

The read-receipt system should only mark a message as seen when the recipient has actually viewed the relevant conversation.

### 2.7 Typing Indicator

When a user starts typing in a conversation:

- The other participant should receive a real-time typing notification.
- The typing indicator should only appear for the relevant conversation.
- The indicator should disappear when the user stops typing.

### 2.8 Online Status

The application should track connected users through Socket.IO.

Users should be able to determine whether another user is currently online.

## 3. Non-Functional Requirements

### Performance

- Messages should be delivered with minimal delay.
- Socket connections should remain responsive.
- The application should avoid unnecessary database queries and socket events.

### Security

- Passwords must not be stored as plain text.
- Authentication tokens must be securely handled.
- Database credentials must be stored in environment variables.
- Sensitive configuration must not be committed to Git.

### Reliability

- Duplicate messages should not be displayed.
- Database failures should be handled gracefully.
- Socket disconnections should not corrupt conversation data.
- Previously stored messages should remain available after reconnecting.

### Maintainability

The application should maintain a clear separation between:

```text
Frontend
    ↓
API / Socket Layer
    ↓
Backend Logic
    ↓
Prisma ORM
    ↓
PostgreSQL
```

## 4. Technology Requirements

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend Runtime | Node.js |
| HTTP Server | Express.js |
| Real-Time Communication | Socket.IO |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | JWT |
| Password Hashing | bcrypt |
| Package Manager | npm |

## 5. Development Requirements

A developer setting up the project should have:

- Node.js installed
- npm installed
- PostgreSQL installed and running
- A PostgreSQL database created
- Valid database credentials
- Git installed

Environment-specific configuration should be provided through `.env` files.

## 6. Future Improvements

Potential future improvements include:

- Reliable real-time read receipts
- Message delivery acknowledgements
- Message timestamps
- Message editing
- Message deletion
- Image/file sharing
- Group conversations
- Push notifications
- Improved reconnection handling
- Message search
- Pagination/infinite scrolling
- Better mobile responsiveness