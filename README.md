# JS Dual Project

A small full-stack JavaScript project that includes a calculator, a todo app, and authentication pages.

## Project Structure

- `app.js` - Express server and API routes
- `database.js` - MySQL connection and data access functions
- `package.json` - project dependencies and scripts
- `HTML/` - front-end pages
- `Styles/` - CSS files for each page
- `Scripts/` - client-side JavaScript logic

## Features

- Signup and login pages backed by MySQL
- User authentication via `/auth/login`
- Persistent todo tasks saved in the `tasks` table
- Task CRUD operations through API endpoints
- Todo page shows tasks for the logged-in user
- Calculator page with a collapsible scientific section

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with your database credentials:

```env
MYSQL_HOST=localhost
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=todoApp
```

3. Start the server

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3001/HTML/first-page.html
```

## API Routes

- `GET /users` - return all users
- `GET /users/:id` - return one user by id
- `POST /users` - create a new user
- `POST /auth/login` - login with email and password
- `GET /tasks?user_id=...` - get tasks for a user
- `POST /tasks` - create a task
- `PATCH /tasks/:id` - update task completion status
- `DELETE /tasks/:id` - delete a task
- `DELETE /tasks?user_id=...` - clear completed tasks for user

## Notes

- The todo page reads the logged-in user from `localStorage`
- Tasks are stored in MySQL and loaded from the server
- The calculator is a standalone page with local client-side logic
