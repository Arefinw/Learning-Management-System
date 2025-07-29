# Development Checklist

## 1. CRITICAL ISSUES

- [ ] **Database Connection Problem (Backend)**
  - Description: The application crashes with "bad auth : authentication failed" if `MONGO_URI` in `.env` is not correctly configured for MongoDB Atlas.
  - Affected Files: `backend/config/db.js` (L5-L12), `backend/server.js` (L10)
  - Reproduction Steps: 
    1. Ensure `backend/.env` has an incorrect or placeholder `MONGO_URI` (e.g., `MONGO_URI=MONGO_URI`).
    2. Run `npm run dev` in `backend/`.
    3. Observe the crash and error message in the console.

- [ ] **Missing `index.html` (Frontend)**
  - Description: The frontend serves a blank page and shows a 404 error for `index.html` if the file is missing.
  - Affected Files: `frontend/index.html` (entire file missing)
  - Reproduction Steps:
    1. Delete `frontend/index.html`.
    2. Run `npm run dev` in `frontend/`.
    3. Open the browser to `http://localhost:5173`.
    4. Observe the blank page and 404 error in the browser console for `index.html`.

- [ ] **Frontend Routing Mismatch**
  - Description: Navigating to `/workspaces` or `/projects` results in "No routes matched location" errors because the routes are not defined in `App.jsx`.
  - Affected Files: `frontend/src/App.jsx` (L20-L25 in previous state)
  - Reproduction Steps:
    1. Log in to the frontend.
    2. Click on "Workspaces" or "Projects" in the sidebar.
    3. Observe the console errors: `No routes matched location "/workspaces"` or `No routes matched location "/projects"`.

## 2. FUNCTIONALITY GAPS

### Backend
- [ ] **Folder CRUD Operations**
  - Description: There are no dedicated routes or controllers for creating, reading, updating, or deleting `Folder` models. Folders are only populated via `ProjectTree`.
  - Affected Files: 
    - Missing: `backend/routes/folder.routes.js`, `backend/controllers/folder.controller.js`
    - Related: `backend/models/Folder.js`, `backend/models/Project.js`
  - Reproduction Steps: Attempt to manage folders via API.

- [ ] **Link, Video, Document CRUD Operations**
  - Description: While `Pathway` can contain `items` of these types, there are no direct CRUD operations for `Link`, `Video`, or `Document` models. They are only managed as part of a `Pathway`.
  - Affected Files: 
    - Missing: `backend/routes/link.routes.js`, `backend/routes/video.routes.js`, `backend/routes/document.routes.js`, `backend/controllers/link.controller.js`, `backend/controllers/video.controller.js`, `backend/controllers/document.controller.js`
    - Related: `backend/models/Link.js`, `backend/models/Video.js`, `backend/models/Document.js`, `backend/models/Pathway.js`, `backend/controllers/pathway.controller.js` (L150-L175 `addItem`)
  - Reproduction Steps: Attempt to manage these content types independently.

- [ ] **User Profile Update (Self)**
  - Description: The `updateUser` controller allows updating any user by ID, but there's no specific endpoint for a logged-in user to update *their own* profile without admin privileges.
  - Affected Files: `backend/controllers/user.controller.js` (L50-L77 `updateUser`)
  - Reproduction Steps: As a regular user, attempt to update your own profile information.

### Frontend
- [ ] **Full CRUD UI for Workspaces**
  - Description: `WorkspaceList` only displays workspaces. There's no UI to create, update, or delete workspaces.
  - Affected Files: `frontend/src/components/workspace/WorkspaceList.jsx`, `frontend/src/components/workspace/WorkspaceDetail.jsx`
  - Reproduction Steps: Navigate to `/workspaces` and observe lack of management options.

- [ ] **Full CRUD UI for Projects**
  - Description: `ProjectList` only displays projects. There's no UI to create, update, or delete projects.
  - Affected Files: `frontend/src/components/project/ProjectList.jsx`, `frontend/src/components/project/ProjectDetail.jsx`
  - Reproduction Steps: Navigate to `/projects` and observe lack of management options.

- [ ] **Full CRUD UI for Folders**
  - Description: `FolderTree` displays folders, but there's no UI to create, update, or delete folders.
  - Affected Files: `frontend/src/components/project/FolderTree.jsx`, `frontend/src/components/project/ProjectTree.jsx`
  - Reproduction Steps: Navigate to a project and observe lack of folder management options.

- [ ] **Full CRUD UI for Pathways**
  - Description: `PathwayList` displays pathways, and `PathwayEditor` allows adding items, but there's no UI to create, update, or delete pathways themselves.
  - Affected Files: `frontend/src/components/pathway/PathwayList.jsx`, `frontend/src/components/pathway/PathwayDetail.jsx`, `frontend/src/components/pathway/PathwayEditor.jsx`
  - Reproduction Steps: Navigate to a project or folder and observe lack of pathway management options.

- [ ] **Full CRUD UI for Pathway Items (Link, Video, Document)**
  - Description: `PathwayEditor` has basic add functionality, but lacks full CRUD for individual items (edit, delete, reorder persistence).
  - Affected Files: `frontend/src/components/pathway/PathwayEditor.jsx` (L100-L104 `handleRemoveItem`, L106-L110 `handleToggleCompleted`, L112-L117 `handleMoveItem` - these are frontend-only updates)
  - Reproduction Steps: Attempt to fully manage items within a pathway.

- [ ] **Error Handling and User Feedback**
  - Description: While `AuthContext` and `api.js` have some error handling, user-facing error messages are often generic (`Server error`) or only logged to console. There's no consistent display of error messages to the user.
  - Affected Files: `frontend/src/context/AuthContext.jsx` (L70, L98), `frontend/src/services/api.js` (L30), `frontend/src/components/common/Error.jsx` (used, but not consistently triggered).
  - Reproduction Steps: Trigger an API error (e.g., invalid login) and observe user feedback.

- [ ] **Loading States and Spinners**
  - Description: Some components have basic loading indicators (`Loading...` text or `Loading` component), but it's not consistently applied across all data-fetching components.
  - Affected Files: `frontend/src/components/pathway/PathwayDetail.jsx` (L25), `frontend/src/components/pathway/PathwayEditor.jsx` (L59), `frontend/src/components/project/ProjectDetail.jsx` (L25), `frontend/src/components/project/ProjectTree.jsx` (L80), `frontend/src/components/workspace/WorkspaceDetail.jsx` (L59)
  - Reproduction Steps: Navigate to pages that fetch data and observe loading behavior.

## 3. ARCHITECTURE REVIEW

- [ ] **Backend: Deprecated Mongoose Methods**
  - Description: Usage of `Model.remove()` is deprecated and should be replaced with `deleteOne()` or `deleteMany()`.
  - Affected Files:
    - `backend/controllers/project.controller.js` (L130 `await project.remove();`)
    - `backend/controllers/pathway.controller.js` (L100 `await pathway.remove();`)
    - `backend/controllers/workspace.controller.js` (L130 `await workspace.remove();`)
  - Reproduction Steps: Check Mongoose documentation for deprecation warnings.

- [ ] **Backend: Inconsistent Error Handling**
  - Description: While `error.middleware.js` exists, not all controllers consistently throw `ErrorResponse` instances. Some still use `res.status(500).send('Server error')` directly.
  - Affected Files: All `backend/controllers/*.js` files (e.g., `auth.controller.js` L49, L97, L115; `pathway.controller.js` L20, L40, L60, L85, L105, L175; `project.controller.js` L20, L40, L75, L105, L135; `search.controller.js` L40; `user.controller.js` L20, L45, L75; `workspace.controller.js` L20, L40, L75, L105, L135, L175)
  - Reproduction Steps: Trigger various error scenarios and observe the response format.

- [ ] **Frontend: Direct Axios Usage vs. `api.js`**
  - Description: Some components directly import and use `axios` instead of the configured `api` instance from `frontend/src/services/api.js`. This bypasses interceptors for token management and error handling.
  - Affected Files:
    - `frontend/src/components/pathway/PathwayDetail.jsx` (L10 `import axios from 'axios';`)
    - `frontend/src/components/pathway/PathwayEditor.jsx` (L10 `import axios from 'axios';`)
    - `frontend/src/components/project/ProjectDetail.jsx` (L10 `import axios from 'axios';`)
    - `frontend/src/components/project/ProjectTree.jsx` (L10 `import axios from 'axios';`)
    - `frontend/src/components/search/SearchBar.jsx` (L4 `import axios from 'axios';`)
    - `frontend/src/components/workspace/WorkspaceDetail.jsx` (L10 `import axios from 'axios';`)
    - `frontend/src/components/workspace/WorkspaceList.jsx` (L6 `import axios from 'axios';`)
    - `frontend/src/context/AuthContext.jsx` (L2 `import axios from 'axios';`)
    - `frontend/src/pages/AdminPanel.jsx` (L2 `import axios from 'axios';`)
  - Reproduction Steps: Observe network requests from these components; they won't have the Authorization header if not logged in, or won't trigger the interceptor's 401 redirect.

- [ ] **Frontend: Component Reusability**
  - Description: Some components might have duplicated logic or could be broken down into smaller, more reusable components (e.g., form inputs, list items).
  - Affected Files: `frontend/src/components/auth/Login.jsx`, `frontend/src/components/auth/Register.jsx` (similar form structures).
  - Reproduction Steps: Review component structure for opportunities for abstraction.

## 4. USER EXPERIENCE ISSUES

- [ ] **Incomplete Pathway Item Display**
  - Description: In `PathwayDetail` and `PathwayEditor`, `item.content` is displayed directly, which is an ObjectId. The actual content (URL, markdown) needs to be fetched and rendered.
  - Affected Files:
    - `frontend/src/components/pathway/PathwayDetail.jsx` (L32 `<li>{item.type}</li>`)
    - `frontend/src/components/pathway/PathwayEditor.jsx` (L79 `<span>{item.type}: {item.content}</span>`)
  - Reproduction Steps: Create a pathway with items and view its details.

- [ ] **ProjectTree Search Filtering Scope**
  - Description: The `matchesSearch` function in `ProjectTree` only checks `item.name` for folders and `item.title` for pathways. It should also include `description` for both.
  - Affected Files: `frontend/src/components/project/ProjectTree.jsx` (L18 `matchesSearch`, L70 `filteredFolders`)
  - Reproduction Steps: Search for a folder or pathway by its description.

- [ ] **ProjectTree Context Menu Positioning**
  - Description: The context menu in `ProjectTree` uses absolute positioning based on `e.clientX` and `e.clientY`, which might cause it to appear off-screen or not ideally positioned relative to the clicked element, especially on smaller screens or near edges.
  - Affected Files: `frontend/src/components/project/ProjectTree.jsx` (L58 `style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}`)
  - Reproduction Steps: Right-click on folder nodes in various screen positions.

- [ ] **Missing Responsive Design Considerations**
  - Description: While Tailwind CSS is used, explicit responsive design adjustments (e.g., for sidebar collapse on mobile, layout changes) are not evident in all components.
  - Affected Files: All frontend components, especially layout components (`Header`, `Sidebar`, `Footer`).
  - Reproduction Steps: Resize the browser window to mobile dimensions.

## 5. PERFORMANCE & SECURITY

### Performance
- [ ] **Backend: Mongoose Population Optimization**
  - Description: When populating referenced documents, often the entire document is fetched. Using `.select()` can limit the fields retrieved, reducing data transfer and improving query performance.
  - Affected Files:
    - `backend/controllers/project.controller.js` (L145 `populate('folders')`)
    - `backend/controllers/workspace.controller.js` (L150 `workspace.members.unshift(newMember);` - when adding members, the populated user object might be larger than needed)
    - `backend/controllers/auth.controller.js` (L112 `select('-password')` is good, but other populations might benefit)
  - Reproduction Steps: Monitor network traffic and database query times for populated routes.

- [ ] **Backend: Database Indexing**
  - Description: Missing database indexes on frequently queried fields can lead to slow query performance on large datasets.
  - Affected Files:
    - `backend/models/User.js`: `email` (already unique, but explicit index can help query speed)
    - `backend/models/Workspace.js`: `owner`
    - `backend/models/Project.js`: `owner`, `workspace`
    - `backend/models/Folder.js`: `project`, `parentFolder`
    - `backend/models/Pathway.js`: `project`, `folder`, `parentPathway`
  - Reproduction Steps: Populate database with large amounts of data and run queries.

- [ ] **Frontend: Debounce Search Inputs**
  - Description: The `SearchBar` and `ProjectTree` search inputs trigger API calls on every keystroke, which can be inefficient for rapid typing.
  - Affected Files:
    - `frontend/src/components/search/SearchBar.jsx` (L10 `onChange` triggers `setQuery`)
    - `frontend/src/components/project/ProjectTree.jsx` (L86 `onChange` triggers `setSearchTerm`)
  - Reproduction Steps: Type quickly into the search bars and observe network requests.

### Security
- [ ] **Backend: Comprehensive Input Validation**
  - Description: While `express-validator` is used for auth routes, it's not consistently applied to all incoming request bodies and query parameters across all routes. This can lead to vulnerabilities like injection attacks or unexpected data.
  - Affected Files: All `backend/routes/*.js` and corresponding `backend/controllers/*.js` files (e.g., `createWorkspace`, `updateWorkspace`, `createProject`, `updateProject`, `createPathway`, `updatePathway`, `addItem`, `addMember`, `updateUser`)
  - Reproduction Steps: Send malformed or unexpected data to various API endpoints.

- [ ] **Backend: Granular Role-Based Authorization**
  - Description: The `protect` middleware only checks for authentication. More granular authorization checks (e.g., ensuring a user can only update their own project/workspace, or only admins can access user lists) are implemented manually in controllers, but could be centralized or made more robust.
  - Affected Files:
    - `backend/controllers/user.controller.js` (L65 `if (user.id.toString() !== req.user.id)`) - for self-update
    - `backend/controllers/workspace.controller.js` (L65, L100, L130, L155 `if (workspace.owner.toString() !== req.user.id)`) - for ownership checks
    - `backend/controllers/project.controller.js` (L65, L100, L130, L155 `if (project.owner.toString() !== req.user.id)`) - for ownership checks
    - `backend/routes/user.routes.js` (L5 `getUsers` is accessible to any authenticated user, but should be admin-only)
  - Reproduction Steps: Attempt to access or modify resources that you should not have permission for.

- [ ] **Backend: Missing Security Headers (Helmet)**
  - Description: The application does not use a middleware like `helmet` to set various HTTP headers that help protect against common web vulnerabilities (e.g., XSS, clickjacking, insecure connections).
  - Affected Files: `backend/server.js`
  - Reproduction Steps: Inspect HTTP response headers.

- [ ] **Backend: CORS Configuration Review**
  - Description: `cors()` is used without specific options, which means it allows all origins. For production, this should be restricted to known origins.
  - Affected Files: `backend/server.js` (L14 `app.use(cors());`)
  - Reproduction Steps: Check CORS headers in network requests.

- [ ] **Backend: JWT Secret Exposure**
  - Description: While `JWT_SECRET` is in `.env`, ensure it's a strong, randomly generated key and not the default `supersecretjwtkey` from `.env.example`.
  - Affected Files: `backend/.env.example`, `backend/controllers/auth.controller.js` (L40, L88), `backend/middleware/auth.middleware.js` (L25)
  - Reproduction Steps: Review `.env` file.

## 6. BEST PRACTICES TO IMPLEMENT

- [ ] **Backend: Centralized Configuration for Constants**
  - Description: Magic numbers and strings (e.g., JWT expiry `3600`) are hardcoded. These should be moved to a centralized configuration file or environment variables for easier management and consistency.
  - Affected Files: `backend/controllers/auth.controller.js` (L40, L88)
  - Reproduction Steps: Review code for hardcoded values.

- [ ] **Backend: Robust Logging**
  - Description: Current logging relies on `console.error`. A more robust logging solution (e.g., Winston, Morgan) would provide better insights into application behavior, errors, and request/response cycles.
  - Affected Files: `backend/server.js`, all `backend/controllers/*.js`, `backend/middleware/error.middleware.js`
  - Reproduction Steps: Observe server logs during operation.

- [ ] **Frontend: PropTypes for Components**
  - Description: React components do not have PropTypes defined, which can lead to unexpected behavior if incorrect props are passed.
  - Affected Files: All `frontend/src/components/**/*.jsx` files.
  - Reproduction Steps: Pass incorrect props to components and observe behavior (no warnings).

- [ ] **Frontend: Custom Hooks for Data Fetching**
  - Description: Many components directly handle data fetching logic within `useEffect`. Custom hooks could abstract this logic, making components cleaner and data fetching reusable.
  - Affected Files: `frontend/src/components/pathway/PathwayDetail.jsx`, `frontend/src/components/pathway/PathwayEditor.jsx`, `frontend/src/components/project/ProjectDetail.jsx`, `frontend/src/components/project/ProjectTree.jsx`, `frontend/src/components/search/SearchBar.jsx`, `frontend/src/components/workspace/WorkspaceDetail.jsx`, `frontend/src/components/workspace/WorkspaceList.jsx`, `frontend/src/context/AuthContext.jsx`, `frontend/src/pages/AdminPanel.jsx`.
  - Reproduction Steps: Review data fetching logic in components.

- [ ] **Frontend: Form Handling Library**
  - Description: Forms are handled manually with `useState` and `onChange` handlers. For more complex forms, a library like Formik or React Hook Form could simplify state management, validation, and submission.
  - Affected Files: `frontend/src/components/auth/Login.jsx`, `frontend/src/components/auth/Register.jsx`, `frontend/src/components/pathway/PathwayEditor.jsx` (add item form), `frontend/src/components/workspace/WorkspaceDetail.jsx` (add member form).
  - Reproduction Steps: Review form implementations.

- [ ] **General: Comprehensive Testing Strategy**
  - Description: There are no evident unit, integration, or end-to-end tests for either the frontend or backend. Implementing a testing strategy is crucial for long-term maintainability and stability.
  - Affected Files: All files (new test files would be created).
  - Reproduction Steps: Attempt to run tests (none exist).

  
