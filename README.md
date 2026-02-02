# Freedom Wall — Serverless MERN Web Application

Freedom Wall is a **serverless MERN-style web application** that allows users to post messages to a public wall, either **anonymously or with a name**, with recipients and music attachments via YouTube.

The application focuses on:
- A **content-first wall/feed**
- **Card-based UI containers**
- A **modal-based post creation flow**
- Scalable serverless backend architecture

---

## Features

- Post messages anonymously or with a display name
- Recipient field for dedication-style messages
- Music attachment via YouTube search and embed
- Public, shared wall visible to all users
- Modal pop-up for creating new entries
- Card-based layout for content clarity
- Cursor-based pagination for performance
- Serverless backend compatible with Vercel

---

## Tech Stack

### Frontend
- React 18
- Vite
- CSS (custom, no UI framework)
- Fetch API with AbortController
- Component-level performance optimizations

### Backend (Serverless)
- Node.js
- MongoDB Atlas
- Vercel Serverless Functions
- Zod for request validation

### External Services
- YouTube Data API v3 (search only, embed via iframe)

---

