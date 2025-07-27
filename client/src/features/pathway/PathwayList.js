import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @description Renders a list of pathways for the current project. Each item links to its respective PathwayPlayerPage.
 * @param {object} props - Component props.
 * @param {Array<object>} props.pathways - An array of pathway objects to be displayed.
 * @returns {JSX.Element} - The list of pathways.
 */
const PathwayList = ({ pathways }) => {
  if (!pathways || pathways.length === 0) {
    return <div>No pathways found for this project.</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Pathways</h3>
      <ul className="space-y-2">
        {pathways.map((pathway) => (
          <li key={pathway._id} className="p-4 border rounded shadow-sm flex justify-between items-center">
            <Link to={`/pathways/${pathway._id}`} className="text-blue-600 hover:underline">{pathway.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PathwayList;
