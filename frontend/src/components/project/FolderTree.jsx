import React from 'react';
import { Link } from 'react-router-dom';

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
