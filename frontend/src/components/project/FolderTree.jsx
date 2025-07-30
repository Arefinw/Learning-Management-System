/**
 * @file FolderTree.jsx
 * @description This component recursively renders a folder and its contents as a tree.
 * It is used within the ProjectTree component to display the project's folder structure.
 * @module components/project/FolderTree
 * @requires react
 * @requires react-router-dom
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @component FolderTree
 * @description A recursive component to display a folder and its sub-folders and pathways in a tree structure.
 * @param {object} props - The component props.
 * @param {object} props.folder - The folder object to render.
 * @returns {JSX.Element} The folder tree node.
 */
const FolderTree = ({ folder }) => {
  return (
    <li>
      <Link to={`/folders/${folder._id}`} className="text-primary hover:underline">
        {folder.name}
      </Link>
      {folder.subFolders && folder.subFolders.length > 0 && (
        <ul className="ml-4">
          {folder.subFolders.map((subFolder) => (
            <FolderTree key={subFolder._id} folder={subFolder} />
          ))}
        </ul>
      )}
      {folder.pathways && folder.pathways.length > 0 && (
        <ul className="ml-4">
          {folder.pathways.map((pathway) => (
            <li key={pathway._id}>
              <Link to={`/pathways/${pathway._id}`} className="text-primary hover:underline">{pathway.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default FolderTree;