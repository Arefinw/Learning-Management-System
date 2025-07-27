import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, fetchProjectsByWorkspace } from '../features/project/projectSlice';
import FolderTree from '../features/project/FolderTree';
import PathwayList from '../features/pathway/PathwayList';
import { fetchPathwaysByProject } from '../features/pathway/pathwaySlice';

/**
 * @description Main page for viewing a project (folder). Fetches project data based on the URL parameter.
 * Renders the FolderTree and PathwayList components.
 * @returns {JSX.Element} - The project view page.
 */
const ProjectViewPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { currentProject, status, error } = useSelector((state) => state.project);
  const { pathways, status: pathwayStatus, error: pathwayError } = useSelector((state) => state.pathway);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (currentProject && currentProject._id) {
      dispatch(fetchPathwaysByProject(currentProject._id));
    }
  }, [currentProject, dispatch]);

  useEffect(() => {
    if (user && user.defaultWorkspace) {
      dispatch(fetchProjectsByWorkspace(user.defaultWorkspace));
    }
  }, [user, dispatch]);

  if (status === 'loading') {
    return <div>Loading projects...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Project View Page</h1>
      {currentProject && <h2 className="text-2xl mb-4">Current Project: {currentProject.name}</h2>}
      <div className="flex">
        <div className="w-1/4 border-r pr-4">
          <FolderTree
            workspaceId={user ? user.defaultWorkspace : null}
            currentProjectId={projectId}
            onProjectSelect={(id) => console.log('Project selected:', id)} // Placeholder
          />
        </div>
        <div className="w-3/4 pl-5">
          <PathwayList pathways={pathways} />
        </div>
      </div>
    </div>
  );
};

export default ProjectViewPage;
