import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPathwayById } from '../features/pathway/pathwaySlice';
import PathwayPlayer from '../features/pathway/PathwayPlayer';

/**
 * @description Page component for playing a pathway. Fetches pathway data based on the URL parameter
 * and renders the PathwayPlayer component.
 * @returns {JSX.Element} - The pathway player page.
 */
const PathwayPlayerPage = () => {
  const { pathwayId } = useParams();
  const dispatch = useDispatch();
  const { currentPathway, status, error } = useSelector((state) => state.pathway);

  useEffect(() => {
    if (pathwayId) {
      dispatch(fetchPathwayById(pathwayId));
    }
  }, [pathwayId, dispatch]);

  if (status === 'loading') {
    return <div>Loading pathway...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Pathway Player Page</h1>
      <PathwayPlayer pathway={currentPathway} />
    </div>
  );
};

export default PathwayPlayerPage;
