/**
 * @file SearchBar.jsx
 * @description This component provides a search bar for searching across the application.
 * It allows users to search for projects, folders, and pathways.
 * @module components/search/SearchBar
 * @requires react
 * @requires ../../services/api
 * @requires antd
 */

import React, { useState } from 'react';
import api from '../../services/api'; // Use the centralized API service
import { message } from 'antd'; // Import Ant Design message component

/**
 * @component SearchBar
 * @description A component that provides a search bar and displays search results.
 * @returns {JSX.Element} The search bar and search results.
 */
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], folders: [], pathways: [] });

  /**
   * @function onChange
   * @description Updates the search query state as the user types.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const onChange = (e) => {
    setQuery(e.target.value);
  };

  /**
   * @function onSubmit
   * @description Submits the search query to the backend and updates the results.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>}
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/api/search?q=${query}`);
      setResults(res.data.data); // Access data property
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.error || 'Failed to perform search.');
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex items-center mb-4">
        <input
          type="text"
          name="query"
          value={query}
          onChange={onChange}
          placeholder="Search..."
          className="form-control rounded-r-none"
        />
        <button type="submit" className="btn btn-primary rounded-l-none">
          Search
        </button>
      </form>

      {results.projects.length > 0 && (
        <div className="card mb-4">
          <h3 className="text-lg font-bold mb-2">Projects</h3>
          <ul>
            {results.projects.map((project) => (
              <li key={project._id} className="py-1">{project.name}</li>
            ))}
          </ul>
        </div>
      )}

      {results.folders.length > 0 && (
        <div className="card mb-4">
          <h3 className="text-lg font-bold mb-2">Folders</h3>
          <ul>
            {results.folders.map((folder) => (
              <li key={folder._id} className="py-1">{folder.name}</li>
            ))}
          </ul>
        </div>
      )}

      {results.pathways.length > 0 && (
        <div className="card mb-4">
          <h3 className="text-lg font-bold mb-2">Pathways</h3>
          <ul>
            {results.pathways.map((pathway) => (
              <li key={pathway._id} className="py-1">{pathway.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
