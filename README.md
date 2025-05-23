﻿# 🍴 Cookbook App

Welcome to the **Cookbook App** — a full-stack web application where users can create, save, and discover recipes while building a community by following other users.

---

## 📋 Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Frontend Stack](#frontend-stack)
- [Backend Stack](#backend-stack)
- [Database Schema](#database-schema)
- [Available Pages](#available-pages)
- [How to Run Locally](#how-to-run-locally)

---

## ✨ Features
- **User Authentication**: Register and log in securely.
- **Create Recipes**: Add dishes with photos, instructions, and styles.
- **Search Recipes**: Search by dish name, category, or cuisine style.
- **Save Favorites**: Quickly save recipes to your personal favorites list.
- **Manage Favorites**: View and remove saved recipes.
- **Follow Other Users**: Build your community by following other users.
- **View Recipes from People You Follow**: See new dishes from users you follow.
- **View Profiles**: Access status and information about users you follow.
- **Responsive Design**: Works beautifully across all devices.

---

## 🚀 Getting Started
This project is divided into two parts:
- **Frontend**: React.js (Bootstrap styling)
- **Backend**: Node.js + Express + PostgreSQL

You will need to run both parts separately.

---

## 🖥 Frontend Stack
- React.js
- React Router
- React Bootstrap

## ⚙️ Backend Stack
- Node.js
- Express.js
- PostgreSQL

---

## 🗄 Database Schema (Simplified)

**Users Table:**
- id (primary key)
- email
- password
- first_name
- last_name
- dob
- status

**Recipes Table:**
- id (primary key)
- user_id (foreign key to Users)
- dish_name
- short_description
- ingredients
- instructions
- style
- category
- prep_time
- servings
- photo_url

**Favorites Table:**
- user_id
- recipe_id

**Followers Table:**
- follower_id
- following_id

---

## 🗺 Available Pages
- `/home` — View your recipes grouped by category.
- `/favorites` — View and manage your favorite recipes.
- `/following-recipes` — Browse recipes posted by users you follow.
- `/followers` — Search users, follow, unfollow, view profiles.
- `/search` — Search for new recipes.
- `/about` — Learn how to use the app.
- `/login`, `/register` — Authentication pages.

---

## 🛠 How to Run Locally

**1. Clone the Repository:**
```bash
 git clone https://github.com/your-username/cookbook-app.git
 cd cookbook-app
```

**2. Setup Backend:**
```bash
 cd backend
 npm install
 npm start
```
Backend will run on `http://localhost:5001`

**3. Setup Frontend:**
```bash
 cd frontend
 npm install
 npm start
```
Frontend will run on `http://localhost:3000`

**4. Environment Variables:**
Set up your `.env` file for the backend with your PostgreSQL database connection.

**5. Database:**
Make sure you have a PostgreSQL server running with the correct schema (see Database Schema section).

---

Made with ❤️ and 🍴 by Alina and Sarah.
