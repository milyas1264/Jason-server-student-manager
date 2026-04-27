# AI Agent Instructions for Student Manager

## Project Overview
This is a React-based student management application built with Vite, utilizing modern web technologies for efficient CRUD operations. The application manages student records with names and marks.

## Architecture & Data Flow
- **Frontend**: Single-page React application using functional components and hooks
- **Backend**: JSON Server (running on port 3000) for RESTful API operations
- **State Management**: React useState for local state management
- **API Communication**: Axios for HTTP requests
- **Styling**: Tailwind CSS for responsive design

## Key Components & Patterns
1. **Main App Component** (`src/App.jsx`):
   - Centralized state management for students, form inputs, and edit mode
   - CRUD operations implementation using axios
   - Responsive UI with Tailwind CSS classes

2. **Data Flow Pattern**:
   ```javascript
   loadStudents() → useState(students) → render list
   form input → useState(name, marks) → addStudent/updateStudent → loadStudents()
   ```

## Development Workflow
1. **Local Development**:
   ```bash
   # Start the development server
   npm run dev

   # In a separate terminal, start JSON server (required)
   json-server --watch db.json
   ```

2. **Build & Deploy**:
   ```bash
   npm run build     # Build for production
   npm run preview   # Preview production build
   npm run deploy    # Deploy to GitHub Pages
   ```

## API Integration
- Base URL: `http://localhost:3000`
- Endpoints:
  - GET `/students` - Fetch all students
  - POST `/students` - Add new student
  - PUT `/students/:id` - Update student
  - DELETE `/students/:id` - Delete student

## Project-Specific Conventions
1. **Form Validation**:
   - Both name and marks are required fields
   - Marks are automatically converted to numbers using `Number(marks)`

2. **UI/UX Patterns**:
   - Consistent button colors for actions (blue=add, green=update, yellow=edit, red=delete)
   - Hover effects on list items and buttons
   - Responsive design with max-width constraints

## Dependencies
- Vite for build tooling
- React 19.x
- Tailwind CSS for styling
- Axios for API requests
- JSON Server for backend mock

## Common Gotchas
1. Ensure JSON Server is running before app startup
2. All API calls are wrapped in try-catch in the base code
3. Form state is cleared after successful operations
4. Edit mode uses same form with state toggle

## Key Files
- `src/App.jsx` - Main application logic and UI
- `db.json` - Database file for JSON Server
- `vite.config.js` - Build configuration
- `tailwind.config.js` - Styling configuration