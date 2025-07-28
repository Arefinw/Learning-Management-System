import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const PathwayList = ({ projectId }) => {
  const { user } = useContext(AuthContext);
  const [pathways, setPathways] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/pathways?project=${projectId}`)
        .then((res) => {
          setPathways(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, projectId]);

  return (
    <div>
      <h3 className="text-lg font-bold">Pathways</h3>
      <ul>
        {pathways.map((pathway) => (
          <li key={pathway._id}>{pathway.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PathwayList;
