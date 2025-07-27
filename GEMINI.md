# AI DIRECTIVE: MERN LMS TECHNICAL BLUEPRINT 

## 1. Technical Directives
*   **Strict Adherence:** All generated code MUST conform to these specifications.
*   **Security First:** All user input must be validated. Passwords must be hashed with `bcryptjs`. All database queries must be parameterized (default Mongoose behavior).
*   **Performance:** Add database indexes to frequently queried fields as specified below.
*   **Error Handling:** Backend controllers must use `try...catch` blocks and return appropriate HTTP status codes (e.g., 400, 401, 403, 404, 500).
*   **NEW -> Comprehensive Commenting Standard:** All generated code must be thoroughly commented according to the following JSDoc-style standard. The goal is clarity and maintainability.
    *   **File-Level Comments:** Every file must begin with a block comment explaining its purpose and its role within the application architecture.
    *   **Function/Method Comments:** Every major function or method must have a block comment explaining:
        *   `@description` A clear, one-sentence summary of what the function does.
        *   `@param` {type} name - Description of each parameter.
        *   `@returns` {type} Description of the return value.
        *   `@route` For API controllers, specify the method and endpoint (e.g., `GET /api/projects/:id`).
    *   **In-line Comments:** Use single-line comments (`//`) to explain complex, non-obvious, or business-critical lines of logic. Do not comment on obvious code (e.g., `// defining a variable`).

## 2. Backend Architecture (Node.js/Express)

### 2.1. Database Models (Mongoose)
*All schemas must include `{ timestamps: true }`.*

*   **User:**
    *   `email`: String, required, unique, **index: true**
    *   (Other fields: `name`, `password`, `defaultWorkspace`, `workspaces` as previously defined)
*   **Workspace:**
    *   (Fields as previously defined)
*   **Project (Folder):**
    *   `parent`: ObjectId, ref: 'Project', default: null, **index: true**
    *   `workspace`: ObjectId, ref: 'Workspace', required, **index: true**
    *   `name`: String, required
    *   (Other fields as previously defined)
*   **Pathway:**
    *   `project`: ObjectId, ref: 'Project', required, **index: true**
    *   `title`: String, required
    *   (Other fields as previously defined)

### 2.2. RESTful API Contracts
*   **`POST /api/users/register`**
    *   **Body:** `{ name, email, password }`
    *   **Response (201):** `{ token, user: { id, name, email } }`
*   **`PUT /api/projects/:id/permissions`**
    *   **Body:** `{ public: boolean, workspace: boolean, private: [userId1, userId2] }`
    *   **Response (200):** Updated project object.
*   **`GET /api/search`**
    *   **Query Params:** `?q={searchTerm}`
    *   **Logic:** Perform a case-insensitive regex search on the `name` field of Projects and the `title` field of Pathways that the current user has permission to view.
    *   **Response (200):** `{ projects: [...], pathways: [...] }`

### 2.3. Middleware
*   **`authMiddleware.js` (`protect`):**
    *   Verifies `Authorization: Bearer <token>` header.
    *   If valid, decodes JWT, finds user in DB, and attaches user object to `req.user`.
    *   If invalid, throws 401 Unauthorized error.
*   **`permissionMiddleware.js` (`checkPermissions`):**
    *   **Logic:** A flexible middleware that checks if `req.user` has access to a requested resource (Project or Pathway). It should examine the resource's `permissions` object against the user's ID and workspace memberships.
    *   **Example Usage:** `router.get('/:id', protect, checkPermissions, getProjectById);`

## 3. Frontend Architecture (React)

### 3.1. State Management (Redux Toolkit)
*   **`authSlice`:** State includes `user`, `token`, `isAuthenticated`, `isLoading`.
*   **`projectSlice`:** State includes `projects`, `currentProject`, `pathwaysInProject`, `status`, `error`. Includes async thunks like `fetchProjectsByWorkspace`.
*   **`pathwaySlice`:** State includes `currentPathway`, `status`, `error`. Includes async thunks like `fetchPathwayById`.

### 3.2. Component Contracts (Props & Responsibilities)
*   **`pages/ProjectViewPage.js`:**
    *   **Responsibility:** Main page for viewing a folder. Fetches project data using a param from URL. Renders `FolderTree` and `PathwayList`.
*   **`features/project/FolderTree.js`:**
    *   **Props:** `workspaceId`, `currentProjectId`, `onProjectSelect(projectId)`
    *   **Responsibility:** Fetches and displays the entire nested folder structure for the given `workspaceId`. Highlights the `currentProjectId`. Invokes `onProjectSelect` when a folder is clicked.
*   **`features/pathway/PathwayList.js`:**
    *   **Props:** `pathways` (array of pathway objects)
    *   **Responsibility:** Renders a list of pathways for the current project. Each item links to its respective `PathwayPlayerPage`.
*   **`features/pathway/PathwayPlayer.js`:**
    *   **Props:** `pathway` (object)
    *   **Responsibility:** Renders the pathway title and maps through `pathway.items`, rendering a `PathwayItem` component for each.
*   **`routes/ProtectedRoute.js`:**
    *   **Responsibility:** A wrapper component that checks `isAuthenticated` state from `authSlice`. If true, renders the `children` prop. If false, redirects to `/login`.