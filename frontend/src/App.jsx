import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WorkspaceList from './components/workspace/WorkspaceList';
import WorkspaceDetail from './components/workspace/WorkspaceDetail';
import ProjectList from './components/project/ProjectList';
import ProjectDetail from './components/project/ProjectDetail';
import PathwayDetail from './components/pathway/PathwayDetail';
import PathwayEditor from './components/pathway/PathwayEditor';
import AdminPanel from './pages/AdminPanel';
import PublicView from './pages/PublicView';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/workspaces" element={<WorkspaceList />} />
                <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/pathways/:id" element={<PathwayDetail />} />
                <Route path="/pathways/:id/edit" element={<PathwayEditor />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/public" element={<PublicView />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
