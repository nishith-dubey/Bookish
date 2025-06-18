# Bookish - Book Review Platform (Backend)

This is the backend of **Bookish**, a full-stack book review platform built with **Node.js**, **Express**, and **MongoDB**. It allows users to browse books, write reviews, and rate books. Admin users can manage books.

---

## Features

- **User Authentication** with JWT
- **Book CRUD APIs** with admin-only access to POST
- **Review System** with automatic rating aggregation
- **MongoDB Aggregation Pipelines** for average ratings and review counts
- **Role-Based Access Control**
- **Modular Architecture**
- **RESTful API Design**

---

## Project Structure

```text
bookish-backend/ 
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── book.controller.js     # Book logic (CRUD, rating)
│   ├── review.controller.js   # Review logic (create, fetch)
│   └── user.controller.js     # User profile logic
├── middlewares/
│   └── authMiddleware.js      # JWT authentication & admin check
├── models/
│   ├── book.model.js          # Book schema
│   ├── review.model.js        # Review schema
│   └── user.model.js          # User schema
├── routes/
│   ├── book.route.js          # Book API routes
│   ├── review.route.js        # Review API routes
│   └── user.route.js          # User API routes
├── .env                       # Environment variables
└── server.js                  # Entry point
```


---

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Dotenv for environment config

---

---

## API Endpoints

### Book Routes (`/api/books`)

| Method | Endpoint        | Description                     | Access         |
|--------|------------------|---------------------------------|----------------|
| GET    | `/`              | Get all books                   | Public         |
| GET    | `/:id`           | Get a specific book             | Public         |
| POST   | `/`              | Create a new book               | Admin only     |

### Review Routes (`/api/reviews`)

| Method | Endpoint        | Description                     | Access         |
|--------|------------------|---------------------------------|----------------|
| GET    | `/?bookId=...`   | Get reviews for a book          | Public         |
| POST   | `/`              | Create a review                 | Authenticated  |

### User Routes (`/api/users`)

| Method | Endpoint        | Description                     | Access         |
|--------|------------------|---------------------------------|----------------|
| GET    | `/:id`           | Get user profile                | Public         |
| PUT    | `/:id`           | Update user profile             | Authenticated  |

---

## Data Models

### Book Model

```js
{
  title: String,      // required
  author: String,     // required
  description: String,
  genre: String,
  rating: Number,     // auto-calculated average
  coverImage: String
}
```
### Review Model

```js
{
  bookId: ObjectId,   // required, references Book
  userId: ObjectId,   // required, references User
  rating: Number,     // required, 1–5
  comment: String
}
```

### User Model

```js
{
  name: String,
  email: String,      // unique
  password: String,   // hashed
  isAdmin: Boolean    // default: false
}
```


## Authentication & Middleware
JWT Authentication (authMiddleware.js)
authenticate: Verifies token and sets req.user

authorizeAdmin: Ensures user is an admin

## Rating Aggregation Logic
On review submission, a MongoDB aggregation pipeline:

Matches all reviews for a book

Groups them to calculate average rating

Updates the book's rating field

