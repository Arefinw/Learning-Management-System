import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProjectTree from './ProjectTree';

const ProjectDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/projects/${id}`)
        .then((res) => {
          setProject(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">{project.name}</h2>
      <p>{project.description}</p>
      <ProjectTree projectId={project._id} />
    </div>
  );
};

export default ProjectDetail;
