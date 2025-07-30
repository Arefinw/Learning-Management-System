/**
 * @file App.jsx
 * @description The main application component that sets up routing and global layout.
 * It uses React Router for navigation and Ant Design's Layout components for structure.
 * AuthProvider wraps the entire application to provide authentication context.
 * @module App
 * @requires react
 * @requires react-router-dom
 * @requires ./components/layout/Navbar
 * @requires ./components/layout/Footer
 * @requires ./pages/Home
 * @requires ./pages/Dashboard
 * @requires ./components/auth/Login
 * @requires ./components/auth/Register
 * @requires ./components/workspace/WorkspaceList
 * @requires ./components/workspace/WorkspaceDetail
 * @requires ./components/workspace/WorkspaceForm
 * @requires ./components/project/ProjectForm
 * @requires ./components/project/ProjectList
 * @requires ./components/project/ProjectDetail
 * @requires ./components/pathway/PathwayDetail
 * @requires ./components/pathway/PathwayEditor
 * @requires ./pages/AdminPanel
 * @requires ./pages/PublicView
 * @requires ./context/AuthContext
 * @requires ./components/auth/PrivateRoute
 */

import React from 'react';
import { Layout } from 'antd';
const { Content } = Layout;
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WorkspaceList from './components/workspace/WorkspaceList';
import WorkspaceDetail from './components/workspace/WorkspaceDetail';
import WorkspaceForm from './components/workspace/WorkspaceForm';
import ProjectForm from './components/project/ProjectForm';
import ProjectList from './components/project/ProjectList';
import ProjectDetail from './components/project/ProjectDetail';
import PathwayDetail from './components/pathway/PathwayDetail';
import PathwayEditor from './components/pathway/PathwayEditor';
import AdminPanel from './pages/AdminPanel';
import PublicView from './pages/PublicView';
import FolderDetail from './components/project/FolderDetail';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

/**
 * @component App
 * @description The root component of the application.
 * It sets up the router and the main layout.
 * @returns {JSX.Element} The main application component.
 */
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar />
          <Layout>

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/public" element={<PublicView />} />

                {/* Protected routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/workspaces" element={<WorkspaceList />} />
                  <Route path="/workspaces/new" element={<WorkspaceForm />} />
                  <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
                  <Route path="/workspaces/:id/edit" element={<WorkspaceForm isEditMode={true} />} />
                  <Route path="/projects" element={<ProjectList />} />
                  <Route path="/projects/new" element={<ProjectForm />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/:id/edit" element={<ProjectForm isEditMode={true} />} />
                  <Route path="/pathways/:id" element={<PathwayDetail />} />
                  <Route path="/pathways/:id/edit" element={<PathwayEditor />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
              </Routes>
            </Content>
          </Layout>
          <Footer />
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;