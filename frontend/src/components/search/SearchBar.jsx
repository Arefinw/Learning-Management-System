import React, { useState } from 'react';
import api from '../../services/api'; // Use the centralized API service
import { message } from 'antd'; // Import Ant Design message component

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], folders: [], pathways: [] });

  const onChange = (e) => {
    setQuery(e.target.value);
  };

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