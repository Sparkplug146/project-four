## Project Four-DevDen Forum
The DevDen Forum website is for users that enjoy coding, or are seeking more knowledge in the subject. This webiste allows users to create a profile, and post answers and questions.

Keoni I

## User Story
As a begginer software engineer, I want to ask questions related to software development, so that I can learn more about coding.

## Website features
Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes (must be logged in to access forum pages)

Forum Features
- Edit Question (only the author)
- Delete Question (only the author)
- Edit Answer (only the author)
- Delete Answer (only the author)

Extra Features
- 404 Page (Not Found)
- API 404 Handling (Backend)
- Loading and error states on frontend pages

## Tech Used
Frontend
- React (Vite)
- React Router
- CSS

Backend
- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens)
- bcrypt

## Project Structure
ProjectFour/
- client/ # React frontend
- server/ # Node/Express backend
- schemas.sql # Creates database + tables
- seed.sql # Adds demo categories/users/questions/answers (optional)
- README.md

## Setup Instructions
Clone the repository
```bash
git clone https://github.com/Sparkplug146/project-four.git

## Database Setup
Open MySQL Workbench
Ordered below, run the SQL scripts...
1. schema.sql
2. (optional) seed.sql
This will create the database...
devden_forum
Tables-users, categories, questions, answers







# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
