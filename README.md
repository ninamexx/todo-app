# Todo App

This is a full-stack Todo application built with a React frontend and an Express backend. The project is designed to help users manage their tasks efficiently with features like task creation, editing, deletion, and prioritization.

## Table of Contents

- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Features](#features)
- [Workway](#workway)
- [API Documentation](#api-documentation)
- [Learn More](#learn-more)

## Getting Started

### Backend Setup

To run the backend server:

```bash
cd backend
npm install
node server.js
```

The backend server will be running on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

To run the frontend application:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be running on [http://localhost:5137](http://localhost:5137).

## Folder Structure

```
todo-app/
├── backend/                # Backend server code
│   ├── server.js           # Express server setup
│   └── package.json        # Backend dependencies
├── frontend/               # Frontend application code
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   ├── lib/            # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── vite.config.ts      # Vite configuration
├── types.ts                # Shared TypeScript types
└── README.md               # Project documentation
```

## Frontend

The frontend is built using React, TypeScript, and Vite. It uses Tailwind CSS for styling and ShadcnUI for UI components. The frontend communicates with the backend via REST API calls using Axios.

### Key Dependencies

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **ShadcnUI**: A UI component library.
- **Axios**: A promise-based HTTP client for making API requests.

## Backend

The backend is built using Express and provides RESTful API endpoints for managing tasks. It uses UUID for generating unique task IDs and CORS for handling cross-origin requests.

### Key Dependencies

- **Express**: A minimal and flexible Node.js web application framework.
- **UUID**: A library for generating unique identifiers.
- **CORS**: A middleware for enabling Cross-Origin Resource Sharing.
- **Body-Parser**: A middleware for parsing incoming request bodies.

## Features

- Task creation, editing, and deletion
- Task prioritization (low, medium, high)
- Task completion toggling
- Pagination, sorting, and searching of tasks

## Workway

1. **Frontend**
   - Import and create suitable components based on ShadcnUI
   - Styling with Tailwind
   - REST API integration using Axios
   - Form validation using Zod
2. **Backend**
   - RESTful API endpoints for task management
   - Data storage in-memory (can be extended to use a database)
3. **Testing**
   - Unit and integration tests (would've been good to implement)

## API Documentation

For detailed API documentation, please refer to the [SwaggerHub API Documentation](https://app.swaggerhub.com/apis-docs/abby-b8a-860/todo-app_api/1.0.0).

## Learn More

To learn more about the frameworks and libraries used in this project, take a look at the following resources:

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadcnUI Documentation](https://shadcn.dev/docs)
- [Express Documentation](https://expressjs.com/en/starter/installing.html)
- [Axios Documentation](https://axios-http.com/docs/intro)
