Expense Tracker..

Project Overview:

Expense Tracker is a full-stack web application that helps users manage their daily expenses. Users can register, log in securely, add expenses, update records, delete expenses, and filter expenses by category.

Technology:

Frontend..

React.js
React Router
Axios
Bootstrap

Backend..

Node.js
Express.js

Database:

MongoDB
Mongoose

Authentication:

JWT Authentication
bcrypt

Features:

User Registration
User Login
JWT Authentication
Protected Routes
Add Expense
Edit Expense
Delete Expense
Category Filter
Dashboard Summary

Frontend Routes

Route:  
 `/register`  
 `/login`  
 `/`  
 `/expenses/new`  
 `/expenses/edit/:id`

Authentication:

`POST /api/auth/register`
`POST /api/auth/login`

Expenses:

 `GET /api/expenses`
 `POST /api/expenses`
 `GET /api/expenses/:id`
 `DELETE /api/expenses/:id`

 Database Collections..

 Users:

 name
 email
 password

 
 Expenses:

 title
 amount
 category
 date
 userId

Env File:

env
PORT=5000
MONGO_URI=MongoDb URL
JWT_SECRET=JWT Token

