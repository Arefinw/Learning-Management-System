import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FolderNode = ({ folder, searchTerm }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const matchesSearch = (item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredSubFolders = folder.subFolders.filter(matchesSearch);
  const filteredPathways = folder.pathways.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasVisibleChildren = filteredSubFolders.length > 0 || filteredPathways.length > 0;

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleCloseContextMenu);
    return () => {
      document.removeEventListener('click', handleCloseContextMenu);
    };
  }, []);

  // Placeholder for drag and drop functionality
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', folder._id);
    // Add visual feedback for dragging
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    // Add visual feedback for drag target
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedFolderId = e.dataTransfer.getData('text/plain');
    // Implement logic to move draggedFolderId into current folder._id
    console.log(`Folder ${draggedFolderId} dropped into ${folder._id}`);
  };

  return (
    <li
      ref={nodeRef}
      onContextMenu={handleContextMenu}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center">
        {hasVisibleChildren && (
          <span
            className="cursor-pointer mr-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '►'}
          </span>
        )}
        <span className="font-semibold">{folder.name}</span>
      </div>
      {isExpanded && hasVisibleChildren && (
        <ul className="ml-4">
          {filteredSubFolders.map((subFolder) => (
            <FolderNode key={subFolder._id} folder={subFolder} searchTerm={searchTerm} />
          ))}
          {filteredPathways.map((pathway) => (
            <li key={pathway._id}>
              <Link to={`/pathways/${pathway._id}`}>{pathway.title}</Link>
            </li>
          ))}
        </ul>
      )}

      {showContextMenu && (
        <div
          className="absolute bg-white border rounded shadow-md py-1 z-10"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Edit
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Delete
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Move
          </button>
        </div>
      )}
    </li>
  );
};

const ProjectTree = ({ projectId }) => {
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/projects/${projectId}/tree`)
        .then((res) => {
          setProject(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const filteredFolders = project.folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="text-lg font-bold">{project.name}</h3>
      <input
        type="text"
        placeholder="Search folders/pathways..."
        className="border p-2 mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredFolders.map((folder) => (
          <FolderNode key={folder._id} folder={folder} searchTerm={searchTerm} />
        ))}
      </ul>
    </div>
  );
};

export default ProjectTree;
