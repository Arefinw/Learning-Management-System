# Development Checklist

## 1. Missing Features

### High Priority
- [ ] **User Profile Management (Frontend)**: Users can view and edit their own profile information (name, email).
  - Description: Implement a dedicated page or section for users to manage their profile.
  - Affected Files: `frontend/src/pages/Dashboard.jsx`, `frontend/src/components/layout/Sidebar.jsx`, `frontend/src/services/user.js`, `frontend/src/App.jsx` (for routing).
  - Estimated Complexity: Medium

- [ ] **Workspace Creation/Management (Frontend)**: Users can create, view, update, and delete their workspaces.
  - Description: Implement UI for full CRUD operations on workspaces.
  - Affected Files: `frontend/src/components/workspace/WorkspaceList.jsx`, `frontend/src/components/workspace/WorkspaceDetail.jsx`, `frontend/src/services/workspace.js`, `frontend/src/App.jsx` (for routing).
  - Estimated Complexity: High

- [ ] **Project Creation/Management (Frontend)**: Users can create, view, update, and delete projects within a workspace.
  - Description: Implement UI for full CRUD operations on projects.
  - Affected Files: `frontend/src/components/project/ProjectDetail.jsx`, `frontend/src/components/project/ProjectTree.jsx`, `frontend/src/services/project.js`, `frontend/src/App.jsx` (for routing).
  - Estimated Complexity: High

- [ ] **Folder Creation/Management (Frontend)**: Users can create, view, update, and delete folders within a project.
  - Description: Implement UI for full CRUD operations on folders.
  - Affected Files: `frontend/src/components/project/FolderTree.jsx`, `frontend/src/services/folder.js` (new file), `frontend/src/App.jsx` (for routing).
  - Estimated Complexity: High

- [ ] **Pathway Creation/Management (Frontend)**: Users can create, view, update, and delete pathways within a project or folder.
  - Description: Implement UI for full CRUD operations on pathways.
  - Affected Files: `frontend/src/components/pathway/PathwayList.jsx`, `frontend/src/components/pathway/PathwayDetail.jsx`, `frontend/src/components/pathway/PathwayEditor.jsx`, `frontend/src/services/pathway.js`, `frontend/src/App.jsx` (for routing).
  - Estimated Complexity: High

- [ ] **Content Item Management (Link, Video, Document) (Frontend)**: Implement UI for creating, updating, and deleting Link, Video, and Document items within a pathway.
  - Description: The `PathwayEditor` has basic add functionality, but needs full CRUD and proper input fields for each type.
  - Affected Files: `frontend/src/components/pathway/PathwayEditor.jsx`, `backend/models/Link.js`, `backend/models/Video.js`, `backend/models/Document.js`, `backend/controllers/pathway.controller.js` (for item manipulation), `backend/routes/pathway.routes.js`.
  - Estimated Complexity: High

### Medium Priority
- [ ] **Role-Based Access Control (Frontend UI)**: Display different UI elements or restrict access based on user roles (user/admin).
  - Description: Implement conditional rendering for admin-specific features and navigation.
  - Affected Files: `frontend/src/components/layout/Header.jsx`, `frontend/src/components/layout/Sidebar.jsx`, `frontend/src/pages/AdminPanel.jsx`, `frontend/src/context/AuthContext.jsx`.
  - Estimated Complexity: Medium

- [ ] **Search Functionality (Frontend)**: Integrate the backend search API with a user-friendly search interface.
  - Description: Display search results clearly and allow navigation to found items.
  - Affected Files: `frontend/src/components/search/SearchBar.jsx`.
  - Estimated Complexity: Medium

- [ ] **Public View for Content**: Implement a public-facing view for content marked as 'public'.
  - Description: Create routes and components to display public workspaces, projects, folders, and pathways without requiring authentication.
  - Affected Files: `frontend/src/pages/PublicView.jsx`, `backend/controllers/workspace.controller.js`, `backend/controllers/project.controller.js`, `backend/controllers/folder.controller.js` (new), `backend/controllers/pathway.controller.js`, `backend/routes/workspace.routes.js`, `backend/routes/project.routes.js`, `backend/routes/pathway.routes.js`.
  - Estimated Complexity: High

### Low Priority
- [ ] **User Profile Management (Backend)**: API endpoint for users to update their own profile (name, email).
  - Description: The `updateUser` controller currently allows updating any user by ID, but needs to be restricted to the authenticated user for self-updates.
  - Affected Files: `backend/controllers/user.controller.js`, `backend/routes/user.routes.js`.
  - Estimated Complexity: Low

- [ ] **Pagination for Lists**: Implement pagination for large lists of data (e.g., users, workspaces, projects, pathways).
  - Description: Improve performance and user experience for large datasets.
  - Affected Files: All controller functions that return lists (`getUsers`, `getWorkspaces`, `getProjects`, `getPathways`), and their corresponding frontend components.
  - Estimated Complexity: Medium

## 2. Bug Fixes Needed

- [ ] **Backend: `project.remove()` is deprecated**:
  - Description: `Model.remove()` is deprecated. Use `deleteOne()` or `deleteMany()` instead.
  - Affected Files: `backend/controllers/project.controller.js`
  - Estimated Complexity: Low

- [ ] **Backend: `pathway.remove()` is deprecated**:
  - Description: `Model.remove()` is deprecated. Use `deleteOne()` or `deleteMany()` instead.
  - Affected Files: `backend/controllers/pathway.controller.js`
  - Estimated Complexity: Low

- [ ] **Backend: `workspace.remove()` is deprecated**:
  - Description: `Model.remove()` is deprecated. Use `deleteOne()` or `deleteMany()` instead.
  - Affected Files: `backend/controllers/workspace.controller.js`
  - Estimated Complexity: Low

- [ ] **Frontend: `WorkspaceDetail` member display**: The `member.user._id` is used as key, but `member.user` is likely populated with the full user object, so `member.user.email` should be used for display.
  - Description: Ensure correct display of member information in WorkspaceDetail.
  - Affected Files: `frontend/src/components/workspace/WorkspaceDetail.jsx`
  - Estimated Complexity: Low

- [ ] **Frontend: PathwayEditor item content display**: `item.content` is an ObjectId, not the actual content.
  - Description: The `PathwayEditor` currently displays `item.content` directly, which is an ObjectId. It needs to fetch and display the actual Link, Video, or Document content.
  - Affected Files: `frontend/src/components/pathway/PathwayEditor.jsx`, `backend/controllers/pathway.controller.js` (needs population of `items.content`).
  - Estimated Complexity: Medium

- [ ] **Frontend: ProjectTree `FolderNode` search filtering**: The `matchesSearch` function is only checking `item.name`. It should also check `item.description` for folders and `item.title` and `item.description` for pathways.
  - Description: Improve search accuracy in the project tree.
  - Affected Files: `frontend/src/components/project/ProjectTree.jsx`
  - Estimated Complexity: Low

- [ ] **Frontend: ProjectTree `FolderNode` context menu positioning**: The context menu might appear off-screen or not relative to the clicked element.
  - Description: Implement more robust positioning for the context menu.
  - Affected Files: `frontend/src/components/project/ProjectTree.jsx`
  - Estimated Complexity: Medium

## 3. Performance Optimizations

- [ ] **Backend: Mongoose Population Optimization**: Use `.select()` to retrieve only necessary fields when populating references to reduce data transfer.
  - Description: For example, when populating `owner` or `members`, only fetch `name` and `email` instead of the entire user object.
  - Affected Files: `backend/controllers/project.controller.js`, `backend/controllers/workspace.controller.js`, `backend/controllers/pathway.controller.js` (for items).
  - Estimated Complexity: Medium

- [ ] **Backend: Indexing Database Fields**: Add indexes to frequently queried fields in Mongoose schemas.
  - Description: Fields like `email` in User, `owner` in Workspace/Project, `project` in Folder/Pathway, `folder` in Pathway.
  - Affected Files: `backend/models/User.js`, `backend/models/Workspace.js`, `backend/models/Project.js`, `backend/models/Folder.js`, `backend/models/Pathway.js`.
  - Estimated Complexity: Low

- [ ] **Backend: Rate Limiting**: Implement rate limiting for API endpoints to prevent abuse and improve stability.
  - Description: Protect against brute-force attacks and excessive requests.
  - Affected Files: `backend/server.js` (new middleware).
  - Estimated Complexity: Medium

- [ ] **Frontend: Lazy Loading Components**: Implement lazy loading for components that are not immediately needed.
  - Description: Use `React.lazy` and `Suspense` for routes or large components to reduce initial bundle size.
  - Affected Files: `frontend/src/App.jsx`, various page and complex components.
  - Estimated Complexity: Medium

- [ ] **Frontend: Debounce Search Input**: Debounce the search input in `SearchBar` and `ProjectTree` to reduce API calls.
  - Description: Only trigger search after a short delay from the last keystroke.
  - Affected Files: `frontend/src/components/search/SearchBar.jsx`, `frontend/src/components/project/ProjectTree.jsx`.
  - Estimated Complexity: Low

## 4. Security Improvements

- [ ] **Backend: Input Validation (Comprehensive)**: Implement more comprehensive input validation using `express-validator` for all incoming request bodies and query parameters.
  - Description: Ensure all fields meet expected formats and constraints to prevent injection attacks and malformed data.
  - Affected Files: All `routes/*.js` files and corresponding `controllers/*.js`.
  - Estimated Complexity: High

- [ ] **Backend: Role-Based Authorization (Granular)**: Implement more granular role-based access control for all API endpoints.
  - Description: Ensure only authorized users (e.g., admins) can access specific routes (e.g., `getUsers`, `updateUser` for other users).
  - Affected Files: All `controllers/*.js` files.
  - Estimated Complexity: High

- [ ] **Backend: Environment Variables for Sensitive Data**: Ensure all sensitive data (JWT secret, database URI) are loaded from environment variables and not hardcoded. (Already done, but good to list as a check).
  - Description: Verify `.env` and `.gitignore` are correctly set up.
  - Affected Files: `.env`, `.gitignore`, `backend/config/db.js`, `backend/controllers/auth.controller.js`.
  - Estimated Complexity: Low

- [ ] **Backend: Helmet for Security Headers**: Implement Helmet middleware to set various HTTP headers for security.
  - Description: Protect against common web vulnerabilities like XSS, clickjacking, etc.
  - Affected Files: `backend/server.js`.
  - Estimated Complexity: Low

- [ ] **Backend: CORS Configuration**: Review and tighten CORS configuration if necessary for production.
  - Description: Ensure only allowed origins can access the API.
  - Affected Files: `backend/server.js`.
  - Estimated Complexity: Low

- [ ] **Backend: Password Hashing (bcrypt salt rounds)**: Ensure bcrypt uses a sufficient number of salt rounds (e.g., 10 or 12). (Currently 10, which is good).
  - Description: Verify the strength of password hashing.
  - Affected Files: `backend/controllers/auth.controller.js`.
  - Estimated Complexity: Low

## 5. Code Quality Issues

- [ ] **Backend: Consistent Error Handling**: Centralize and standardize error handling across all controllers.
  - Description: Use the `error.middleware.js` consistently and ensure all `try-catch` blocks return appropriate `ErrorResponse` instances.
  - Affected Files: All `controllers/*.js` files.
  - Estimated Complexity: Medium

- [ ] **Backend: JSDoc Comments**: Add comprehensive JSDoc comments to all functions, routes, and models as per the `GEMINI.md` specification.
  - Description: Improve code readability and maintainability.
  - Affected Files: All backend `.js` files.
  - Estimated Complexity: High

- [ ] **Frontend: Prop Types Validation**: Implement PropTypes for all React components to validate props.
  - Description: Improve component reusability and prevent common bugs.
  - Affected Files: All `frontend/src/components/**/*.jsx` files.
  - Estimated Complexity: High

- [ ] **Frontend: Consistent State Management**: Review and ensure consistent patterns for state management (useState, useContext) across components.
  - Description: Avoid unnecessary state, lift state up where appropriate.
  - Affected Files: All `frontend/src/components/**/*.jsx` files.
  - Estimated Complexity: Medium

- [ ] **Frontend: Axios Interceptors Usage**: Ensure all API calls leverage the `api.js` Axios instance with interceptors for consistent error handling and token management.
  - Description: Avoid direct `axios.get/post` calls where `api.get/post` should be used.
  - Affected Files: `frontend/src/components/**/*.jsx` (e.g., `PathwayDetail`, `PathwayEditor`, `ProjectDetail`, `SearchBar`, `WorkspaceDetail`, `WorkspaceList`, `AdminPanel`).
  - Estimated Complexity: Medium

- [ ] **General: Naming Conventions**: Verify all variables, functions, components, and files adhere to the specified naming conventions (camelCase, PascalCase, kebab-case, UPPER_SNAKE_CASE).
  - Description: Ensure consistency across the entire codebase.
  - Affected Files: All files.
  - Estimated Complexity: Medium

## 6. Best Practices to Implement

- [ ] **Backend: Centralized Configuration**: Move magic strings and numbers (e.g., JWT expiry, bcrypt salt rounds) into a centralized configuration file or environment variables.
  - Description: Improve maintainability and flexibility.
  - Affected Files: `backend/controllers/auth.controller.js`.
  - Estimated Complexity: Low

- [ ] **Backend: Logging**: Implement a more robust logging solution (e.g., Winston, Morgan) for server activities and errors.
  - Description: Improve debugging and monitoring capabilities.
  - Affected Files: `backend/server.js`, `backend/middleware/error.middleware.js`.
  - Estimated Complexity: Medium

- [ ] **Frontend: Custom Hooks for API Calls**: Create custom hooks (e.g., `useFetchProjects`, `useAuth`) to encapsulate API call logic and state management for data fetching.
  - Description: Reduce boilerplate in components and improve reusability.
  - Affected Files: `frontend/src/components/**/*.jsx` that make direct API calls, `frontend/src/hooks/` (new hooks).
  - Estimated Complexity: High

- [ ] **Frontend: UI Component Library/Design System**: Consider using a UI component library or establishing a design system for consistent UI/UX.
  - Description: While Tailwind CSS is used, a component library can further standardize UI elements.
  - Affected Files: All `frontend/src/components/**/*.jsx` files.
  - Estimated Complexity: High

- [ ] **Frontend: Form Handling Library**: Use a form handling library (e.g., Formik, React Hook Form) for complex forms.
  - Description: Simplify form state management, validation, and submission.
  - Affected Files: `frontend/src/components/auth/Login.jsx`, `frontend/src/components/auth/Register.jsx`, `frontend/src/components/pathway/PathwayEditor.jsx`, `frontend/src/components/workspace/WorkspaceDetail.jsx`.
  - Estimated Complexity: Medium

- [ ] **General: Comprehensive Testing**: Implement unit, integration, and end-to-end tests for both frontend and backend.
  - Description: Ensure application stability and correctness.
  - Affected Files: All files (new test files).
  - Estimated Complexity: High
