import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], folders: [], pathways: [] });

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex items-center">
        <input
          type="text"
          name="query"
          value={query}
          onChange={onChange}
          placeholder="Search..."
          className="border rounded-l py-2 px-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
        >
          Search
        </button>
      </form>

      {results.projects.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Projects</h3>
          <ul>
            {results.projects.map((project) => (
              <li key={project._id}>{project.name}</li>
            ))}
          </ul>
        </div>
      )}

      {results.folders.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Folders</h3>
          <ul>
            {results.folders.map((folder) => (
              <li key={folder._id}>{folder.name}</li>
            ))}
          </ul>
        </div>
      )}

      {results.pathways.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Pathways</h3>
          <ul>
            {results.pathways.map((pathway) => (
              <li key={pathway._id}>{pathway.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;