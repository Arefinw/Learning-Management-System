/**
 * @file Dashboard.jsx
 * @description This file implements the Dashboard page component.
 * It displays user-specific information, statistics, recent activities, and quick action buttons.
 * It connects to backend APIs to fetch user data and other relevant statistics.
 */

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import { Link } from 'react-router-dom';

/**
 * Dashboard Component
 * @returns {JSX.Element} The Dashboard page.
 */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    /**
     * Fetches dashboard data from the backend.
     * @async
     * @function fetchDashboardData
     * @returns {Promise<void>}
     */
    const fetchDashboardData = async () => {
      try {
        // Fetch user profile (if not already available from AuthContext or if more detailed profile is needed)
        // For now, we'll rely on the user from AuthContext.
        // In a real app, you might have a /api/users/me endpoint for detailed profile.

        // Fetch some statistics or recent activities.
        // Assuming backend has an endpoint like /api/dashboard/stats or similar.
        // If not, we'll use mock data for now.
        const response = await api.get('/api/dashboard/stats'); // This endpoint might not exist yet.
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* User Profile Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome, {user?.name || 'User'}!</h2>
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/100" // Placeholder for user avatar
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-300"
          />
          <div>
            <p className="text-lg text-gray-600">Email: {user?.email}</p>
            <p className="text-lg text-gray-600">Role: {user?.role}</p>
            {/* Add more user details as needed */}
          </div>
        </div>
        <div className="mt-4">
          <Link
            to="/profile" // Assuming a profile page exists
            className="text-blue-600 hover:underline"
          >
            View Profile
          </Link>
        </div>
      </section>

      {/* Statistics/Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Workspaces</h3>
          <p className="text-4xl font-bold text-blue-600">{dashboardData?.totalWorkspaces || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Projects</h3>
          <p className="text-4xl font-bold text-green-600">{dashboardData?.totalProjects || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Completed Pathways</h3>
          <p className="text-4xl font-bold text-purple-600">{dashboardData?.completedPathways || 0}</p>
        </div>
      </section>

      {/* Quick Action Buttons */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/workspaces/new"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Create New Workspace
          </Link>
          <Link
            to="/projects/new"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Create New Project
          </Link>
          <Link
            to="/pathways/new"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Create New Pathway
          </Link>
          <Link
            to="/search"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Search Content
          </Link>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
          <ul className="space-y-3">
            {dashboardData.recentActivities.map((activity, index) => (
              <li key={index} className="border-b pb-3 last:border-b-0">
                <p className="text-gray-800 font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent activity to display.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;