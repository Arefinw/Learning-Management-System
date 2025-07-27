import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectsByWorkspace } from './projectSlice';

/**
 * @description Fetches and displays the entire nested folder structure for a given workspace.
 * Highlights the current project and invokes a callback when a folder is clicked.
 * @param {object} props - Component props.
 * @param {string} props.workspaceId - The ID of the workspace to display the folder tree for.
 * @param {string} props.currentProjectId - The ID of the currently selected project.
 * @param {function} props.onProjectSelect - Callback function invoked when a project is selected.
 * @returns {JSX.Element} - The folder tree component.
 */
const FolderTree = ({ workspaceId, currentProjectId, onProjectSelect }) => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector((state) => state.project);

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchProjectsByWorkspace(workspaceId));
    }
  }, [workspaceId, dispatch]);

  const renderFolder = (folder) => (
    <li key={folder._id} className={`p-2 rounded ${folder._id === currentProjectId ? 'font-bold bg-gray-200' : ''}`}>
      <span onClick={() => onProjectSelect(folder._id)} className="cursor-pointer">{folder.name}</span>
      {projects.filter(f => f.parent === folder._id).length > 0 && (
        <ul className="pl-4 mt-2 space-y-2">
          {projects.filter(f => f.parent === folder._id).map(renderFolder)}
        </ul>
      )}
    </li>
  );

  if (status === 'loading') {
    return <div>Loading folder tree...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Folder Tree (Workspace: {workspaceId})</h3>
      <ul className="space-y-2">
        {projects.filter(f => f.parent === null).map(renderFolder)}
      </ul>
    </div>
  );
};

export default FolderTree;
